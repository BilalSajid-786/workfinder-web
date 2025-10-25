import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPannelComponent } from './chat-pannel.component';

describe('ChatPannelComponent', () => {
  let component: ChatPannelComponent;
  let fixture: ComponentFixture<ChatPannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatPannelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatPannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
