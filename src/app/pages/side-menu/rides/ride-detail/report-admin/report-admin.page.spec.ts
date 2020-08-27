import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReportAdminPage } from './report-admin.page';

describe('ReportAdminPage', () => {
  let component: ReportAdminPage;
  let fixture: ComponentFixture<ReportAdminPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportAdminPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
