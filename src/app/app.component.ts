import { Component, ElementRef, ViewChild } from '@angular/core';
import { Overworld } from './game-objects/overworld';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('gameContainer')
  gameContainer!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    const overworld: Overworld = new Overworld({ element: this.gameContainer.nativeElement });
    overworld.init('demoRoom');
  }

}
