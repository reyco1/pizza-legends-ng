import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public scale: number = 3;
  public room: string = 'demoRoom';

  ngAfterViewInit(): void { }

}
