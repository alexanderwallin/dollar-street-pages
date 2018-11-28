import { Injectable } from '@angular/core';

import { CountryIncomeDistribution } from '../../interfaces';
import IncomeDistributionData from './data';
import CountryNameToCodeMap from './country-names';

@Injectable()
export class IncomeMountainService {
  public constructor() {}

  /**
   * Returns income distribution data for a given country.
   */
  public getCountryIncomeDistribution(countryName: string): any {
    const countryCode = CountryNameToCodeMap[countryName]
    const entry = IncomeDistributionData.find(x => x.country === countryCode.toLowerCase());

    if (entry) {
      const countryIncomeDistribution: CountryIncomeDistribution = {
        country: entry.country,
        population: entry.population_total,
        incomePerPerson: entry.income_per_person_gdppercapita_ppp_inflation_adjusted,
        gapminderGini: entry.gapminder_gini,
      }

      return countryIncomeDistribution;
    }

    return null;
  }
}
