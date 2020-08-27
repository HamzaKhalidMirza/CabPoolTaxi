import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccountSettingPage } from './account-setting.page';

describe('AccountSettingPage', () => {
  let component: AccountSettingPage;
  let fixture: ComponentFixture<AccountSettingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSettingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
