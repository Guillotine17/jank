import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextcanvasComponent } from './textcanvas.component';

describe('TextcanvasComponent', () => {
  let component: TextcanvasComponent;
  let fixture: ComponentFixture<TextcanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextcanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextcanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
