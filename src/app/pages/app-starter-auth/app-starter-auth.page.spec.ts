import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppStarterAuthPage } from './app-starter-auth.page';

describe('AppStarterAuthPage', () => {
  let component: AppStarterAuthPage;
  let fixture: ComponentFixture<AppStarterAuthPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppStarterAuthPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AppStarterAuthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
