import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RidesPage } from './rides.page';

describe('RidesPage', () => {
  let component: RidesPage;
  let fixture: ComponentFixture<RidesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RidesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RidesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
