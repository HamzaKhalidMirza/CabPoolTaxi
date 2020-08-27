import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GeneralTopicsPage } from './general-topics.page';

describe('GeneralTopicsPage', () => {
  let component: GeneralTopicsPage;
  let fixture: ComponentFixture<GeneralTopicsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralTopicsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralTopicsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
