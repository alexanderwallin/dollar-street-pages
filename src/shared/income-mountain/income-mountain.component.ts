import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild
} from '@angular/core'
import { scaleLinear, scaleLog } from 'd3-scale'
import { area } from 'd3-shape'
import { select } from 'd3-selection'
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';

import { DEBOUNCE_TIME, DefaultUrlParameters } from '../../defaultState';
import { CountryIncomeDistribution, Point } from '../../interfaces';
import { IncomeMountainService } from './income-mountain.service';

/**
 * <income-mountain />
 *
 * This component takes metrics from a country's income data and renders
 * a bell-shaped income distribution graph.
 *
 * NOTE(alexanderwallin): This component operates on a income-per-day basis,
 * in contrast to the street components income-per-month scale.
 */
@Component({
  selector: 'income-mountain',
  templateUrl: './income-mountain.component.html',
  styleUrls: ['./income-mountain.component.css']
})
export class IncomeMountainComponent implements AfterViewInit, OnChanges, OnDestroy {
  /**
   * This maps the income range from $/month to $/day, which is what we use
   * to plot income distribution.
   */
  private static INCOME_RANGE = [
    parseFloat(DefaultUrlParameters.lowIncome) * 12 / 365,
    parseFloat(DefaultUrlParameters.highIncome) * 12 / 365
  ];

  @ViewChild('svg')
  public svg: ElementRef;

  @Input()
  public countryIncomeDistribution: CountryIncomeDistribution | null;

  @Input()
  public color: string;

  private incomeService: IncomeMountainService;
  private data: Point[] = [];
  private resizeSubscribe: Subscription;

  public constructor(incomeMountainService: IncomeMountainService) {
    this.incomeService = incomeMountainService;
  }

  public ngOnChanges() {
    if (this.countryIncomeDistribution !== null) {
      // Get relative income distribution
      const points = this.incomeService.getPointsFromMetrics(
        this.countryIncomeDistribution,
        IncomeMountainComponent.INCOME_RANGE
      );
      this.data = points.map((p): Point => [p.x, p.y])
    }
    else {
      this.data = [];
    }

    // Draw the graph
    this.drawGraph();
  }

  public ngAfterViewInit(): void {
    // Re-draw the graph when the window size changes
    this.resizeSubscribe = fromEvent(window, 'resize')
      .debounceTime(DEBOUNCE_TIME)
      .subscribe(() => {
        this.drawGraph();
      });
  }

  public ngOnDestroy(): void {
    if (this.resizeSubscribe) {
      this.resizeSubscribe.unsubscribe();
    }
  }

  /**
   * Draws the income mountain graph into the <svg> after first emptying it.
   */
  private drawGraph() {
    const $svg = this.svg.nativeElement;
    const bounds = $svg.getBoundingClientRect();

    // Defines axis scales
    const x = scaleLog().domain(IncomeMountainComponent.INCOME_RANGE).range([0, bounds.width]);
    const y = scaleLinear().domain([0, 1]).range([bounds.height, 0]);

    // Create an area
    const graphArea = area()
      .x(d => x(d[0]))
      .y0(d => y(0))
      .y1(d => y(d[1]));

    // Clear the SVG
    select($svg).selectAll('*').remove()

    // Draw the path into the <svg>
    select($svg)
      .append('path')
      .style('fill', this.color)
      .data([this.data])
      .attr('d', graphArea);
  }
}
