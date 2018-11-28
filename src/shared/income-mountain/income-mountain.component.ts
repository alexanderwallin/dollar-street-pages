import { Component, Input } from '@angular/core'

import { CountryIncomeDistribution } from '../../interfaces';
import { IncomeMountainService } from './income-mountain.service';

@Component({
  selector: 'income-mountain',
  templateUrl: './income-mountain.component.html',
  styleUrls: ['./income-mountain.component.css']
})
export class IncomeMountainComponent {
  private incomeService: IncomeMountainService;

  @Input()
  public data: CountryIncomeDistribution | null;

  public constructor(incomeMountainService: IncomeMountainService) {
    console.log('component constructor');

    this.incomeService = incomeMountainService;
  }
}
