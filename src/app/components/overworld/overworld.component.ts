import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Overworld } from 'src/app/game-objects/overworld';

@Component({
  selector: 'overworld',
  templateUrl: './overworld.component.html',
  styleUrls: ['./overworld.component.scss']
})
export class OverworldComponent implements AfterViewInit {

  @Input() scale: number = 3;
  @Input() room: string = 'demoRoom';

  @ViewChild('gameContainer')
  gameContainer!: ElementRef<HTMLElement>;

  @ViewChild('gameCanvas')
  gameCanvas!: ElementRef<HTMLCanvasElement>;

  constructor() { }

  ngAfterViewInit(): void {
    const overworld: Overworld = new Overworld({
      element: this.gameContainer.nativeElement,
      canvas: this.gameCanvas.nativeElement
    });
    overworld.init(this.room);
  }

}
