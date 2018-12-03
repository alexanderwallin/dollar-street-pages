import { Component, ElementRef, Input, ViewChild } from '@angular/core'
import { scaleLinear, scaleLog } from 'd3-scale'
import { area } from 'd3-shape'
import { select } from 'd3-selection'

import { CountryIncomeDistribution } from '../../interfaces';
import { IncomeMountainService } from './income-mountain.service';

@Component({
  selector: 'income-mountain',
  templateUrl: './income-mountain.component.html',
  styleUrls: ['./income-mountain.component.css']
})
export class IncomeMountainComponent {
  private incomeService: IncomeMountainService;

  // This maps $/month to $/day, which is what we use to plot
  // income distribution.
  private static INCOME_RANGE = [
    16 * 12 / 365,
    10800 * 12 / 365
  ]

  @ViewChild('svg')
  public svg: ElementRef;

  @Input()
  public countryIncomeDistribution: CountryIncomeDistribution | null;

  @Input()
  public color: string;

  public constructor(incomeMountainService: IncomeMountainService) {
    this.incomeService = incomeMountainService;
  }

  public ngOnChanges() {
    if (this.countryIncomeDistribution !== null) {
      const $svg = this.svg.nativeElement;
      const bounds = $svg.getBoundingClientRect();

      // Get relative income distribution
      const points = this.incomeService.getPointsFromMetrics(
        this.countryIncomeDistribution,
        IncomeMountainComponent.INCOME_RANGE
      );
      const data = points.map(p => [p.x, p.y]);

      // Defines axis scales
      const x = scaleLog().domain(IncomeMountainComponent.INCOME_RANGE).range([0, bounds.width]);
      const y = scaleLinear().domain([0, 1]).range([bounds.height, 0]);

      // Create an area
      const graphArea = area()
        .x(d => x(d[0]))
        .y0(d => y(0))
        .y1(d => y(d[1]));

      // Draw the path into the <svg>
      select($svg)
        .append('path')
        .style('fill', this.color)
        .data([data])
        .attr('d', graphArea);
    }
  }
}
