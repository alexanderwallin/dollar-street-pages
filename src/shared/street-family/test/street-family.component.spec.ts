import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import {
    BrowserDetectionService
} from '../../../common';
import {
    BrowserDetectionServiceMock
} from '../../../test/';
import { StreetFamilyComponent } from '../street-family.component';
import { StreetFamilyDrawService } from '../street-family.service';
import { IncomeMountainComponent } from '../../income-mountain/income-mountain.component';
import { IncomeMountainService } from '../../income-mountain/income-mountain.service';

describe('StreetFamilyComponent', () => {
    let fixture: ComponentFixture<StreetFamilyComponent>;
    let component: StreetFamilyComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({})
            ],
            declarations: [
              StreetFamilyComponent,
              IncomeMountainComponent
            ],
            providers: [
                StreetFamilyDrawService,
                IncomeMountainService,
                { provide: BrowserDetectionService, useClass: BrowserDetectionServiceMock }
            ]
        });

        fixture = TestBed.createComponent(StreetFamilyComponent);
        component = fixture.componentInstance;
    }));

    it('ngAfterViewInit(), ngOnDestroy()', () => {
        component.ngAfterViewInit();

        expect(component.streetSettingsStateSubscription).toBeDefined();
        expect(component.resizeSubscribe).toBeDefined();

        spyOn(component.streetSettingsStateSubscription, 'unsubscribe');
        spyOn(component.resizeSubscribe, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.streetSettingsStateSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.resizeSubscribe.unsubscribe).toHaveBeenCalled();
    });
});
