import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Overworld } from '../../factory/overworld';

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

  constructor(
    private overworldFactory: Overworld
  ) { }

  ngAfterViewInit(): void {
    this.overworldFactory.setConfig({
      element: this.gameContainer.nativeElement,
      canvas: this.gameCanvas.nativeElement,
      scale: this.scale,
    });
    this.overworldFactory.init(this.room);
  }

}
