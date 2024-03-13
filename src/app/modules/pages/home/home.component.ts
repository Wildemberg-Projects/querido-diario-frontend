import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { ContentService } from 'src/app/services/content/content.service';
import { VideoModalComponent } from '../../components/video-modal/video-modal.component';
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {
  content$: Observable<any> = of(null)

  constructor(
    private modal: MatDialog,
    private contentService: ContentService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  ngOnInit() {
   this.content$ = this.contentService.find('home');
   // Adiciona TAG <link> com rel=canonical 
   const link: HTMLLinkElement = this.renderer.createElement('link');
   link.setAttribute('rel', 'canonical');
   this.renderer.appendChild(this.document.head, link);
   link.setAttribute('href', this.document.URL);
  }

  openVideo(): void {
    this.modal.open(VideoModalComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
    });
  }
}
