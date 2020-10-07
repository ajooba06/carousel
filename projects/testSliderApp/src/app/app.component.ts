import { Component, ViewChildren } from '@angular/core';
import { SliderLibComponent } from 'slider-lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  myCarousel;
	carouselWidth = 640;
	carouselHeight = 220;

	images = [
		{
			path: '/assets/1.jpg'
		},
		{
			path: '/assets/2.jpg'
		},
		{
			path: '/assets/3.jpg'
		},
		{
			path: '/assets/4.jpg'
		},
		{
			path: '/assets/5.jpg'
		},
		{
			path: '/assets/6.jpg'
		},
		{
			path: '/assets/7.jpg'
		},
		{
			path: '/assets/8.jpg'
		},
		{
			path: '/assets/9.jpg'
		},
		{
			path: '/assets/10.jpg'
		}
	];

    images2 = [
        {
            path: '/assets/mars001.jpg',
        },
        {
            path: '/assets/mars002.jpg',
        },
        {
            path: '/assets/mars003.jpg',
        },
        {
            path: '/assets/mars004.jpg',
        },
        {
            path: '/assets/mars005.jpg',
        },
    ];

	@ViewChildren(SliderLibComponent) sliderLibComponent;

    ngOnInit(){
    }

    ngAfterViewInit() {
        this.myCarousel = this.sliderLibComponent.find(elem => elem.id === "my-carousel");
    }

    requestFullscreen() {
    	document.documentElement.requestFullscreen();
    }

	handleCarouselEvents(event) {
		if (event.type === "click") {
			console.log(event);
		}
	}

	addImage() {
		this.images.push({
			path: '/assets/10.jpg'
		});
	}

	next() {
		this.myCarousel.next();
	}

	prev() {
		this.myCarousel.prev();
	}

	resize() {
		if (this.carouselWidth === 320) {
			this.carouselWidth = 480;
			this.carouselHeight = 320;
		} else {
			this.carouselWidth = 320;
			this.carouselHeight = 220;
		}
	}

	select(index) {
		this.myCarousel.select(index);
	}

	changeImagesArray() {
		this.images = this.images2;
	}

}
