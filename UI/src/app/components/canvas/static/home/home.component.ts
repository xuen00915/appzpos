import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // The branded homepage is bundled locally; GetHomePageDetails was unused.
  readonly objComponentData = { Bit_Client_Specific_Home: 1 };
}
