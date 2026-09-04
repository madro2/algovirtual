import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  next: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  scrollTo(targetId: string, event: Event): void {
    event.preventDefault();
    this.next = true;
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
