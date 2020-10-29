import { ChangeDetectorRef, Component, ElementRef, ViewChild, EventEmitter, HostBinding, HostListener, Input, Output, OnDestroy, SimpleChanges } from '@angular/core';

import { Images } from './interfaces';
import { Touches } from './touches';
import { Slider } from './slider';


@Component({
    selector: 'carousel-slider, [carousel-slider]',
    exportAs: 'carousel-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.sass']
})

export class SliderLibComponent implements OnDestroy {

    get isHolderLocked() {
        return this.carousel.isHolderLocked;
    }
    get slideCounter() {
        return this.carousel.slideCounter;
    }
    get previousSlideCounter() {
        return this.carousel.previousSlideCounter;
    }
    get stepLocked() {
        return this.carousel.stepLocked;
    }

    queueCells() {
        this.carousel.queueCells();
    }

    rapidlyPositionContainer() {
        this.carousel.rapidlyPositionContainer();
    }

    _id: string;
    _images: Images;
    press: any;
    carousel: any;
    landscapeMode: any;
    minTimeout = 30;
    isVideoPlaying: boolean;
    _isCounter: boolean;
    _width: number;
    _cellWidth: number | '100%' = 200;
    isMoving: boolean;
    isNgContent: boolean;
    cellLength: number;
    dotsArr: any;

    get isLandscape() {
        return window.innerWidth > window.innerHeight;
    }

    get isSafari(): any {
        const ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('safari') !== -1) {
            return !(ua.indexOf('chrome') > -1);
        }
    }

    get counter() {
        let counter;

        if (this.loop) {
            counter = this.slideCounter % this.cellLength;
        } else {
            counter = this.slideCounter;
        }

        return counter + 1 + this.counterSeparator + this.cellLength;
    }

    get cellsElement() {
        return this.elementRef.nativeElement.querySelector('.carousel-cells');
    }

    @Input()
    set images(images: Images & any) {
        this._images = images;
    }
    get images() {
        return this._images;
    }

    @Output() events: EventEmitter<any> = new EventEmitter<any>();
    
    @Output() nextClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() prevClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() isNextDisabled: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() isPrevDisabled: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input() height: number = 200;
    @Input() width: number;
    @Input() loop: boolean = false;
    @Input() autoplay: boolean = false;
    @Input() autoplayInterval: number = 5000;
    @Input() pauseOnHover: boolean = true;
    @Input() dots: boolean = false;
    @Input() borderRadius: number;
    @Input() margin: number = 10;
    @Input() objectFit: 'contain' | 'cover' | 'none' = 'cover';
    @Input() minSwipeDistance: number = 10;
    @Input() transitionDuration: number = 200;
    @Input() transitionTimingFunction: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' = 'ease';
    @Input() videoProperties: any;
    @Input() counterSeparator: string = " / ";
    @Input() overflowCellsLimit: number = 3;
    @Input() listeners: 'auto' | 'mouse and touch' = 'mouse and touch';
    @Input() cellsToShow: number;
    @Input() cellsToScroll: number = 1;

    @Input('cellWidth') set cellWidth(value: number | '100%') {
        if (value) {
            this._cellWidth = value;
        }
    }

    @Input('counter') set isCounter(value: boolean) {
        if (value) {
            this._isCounter = value;
        }
    }
    get isCounter() {
        return this._isCounter && this.cellLength > 1;
    }

    get activeDotIndex() {
        return this.slideCounter % this.cellLength;
    }

    @Input() arrows: boolean = true;
    @Input() arrowsOutside: boolean;
    @Input() arrowsTheme: 'light' | 'dark' = 'light';

    get cellLimit() {
        if (this.carousel) {
            return this.carousel.cellLimit;
        }
    }

    @HostBinding('class.carousel') hostClassCarousel: boolean = true;
    @HostBinding('style.height') hostStyleHeight: string;
    @HostBinding('style.width') hostStyleWidth: string;

    @HostListener('window:resize', ['$event'])
    onWindowResize(event: any) {
        this.reRenderCarousel();
    }

    @HostListener('mousemove', ['$event'])
    onMousemove(event: MouseEvent) {
        if (this.autoplay && this.pauseOnHover) {
            this.carousel.stopAutoplay();
        }
    }

    @HostListener('mouseleave', ['$event'])
    onMouseleave(event: MouseEvent) {
        if (this.autoplay && this.pauseOnHover) {
            this.carousel.autoplay();
        }
    }

    constructor(
        private elementRef: ElementRef,
        private ref: ChangeDetectorRef) {
    }
    reRenderCarousel() {
        this.landscapeMode = this.isLandscape;
        this.ref.detectChanges();
        this.initCarousel();
        this.carousel.queueCells();
    }
    ngOnInit() {
        this.isNgContent = this.cellsElement.children.length > 0;

        this.press = new Touches({
            element: this.cellsElement,
            listeners: this.listeners,
            mouseListeners: {
                "mousedown": "handleMousedown",
                "mouseup": "handleMouseup"
            }
        });

        this.press.on('touchstart', this.handleTouchstart);
        this.press.on('horizontal-swipe', this.handleHorizontalSwipe);
        this.press.on('touchend', this.handleTouchend);
        this.press.on('mousedown', this.handleTouchstart);
        this.press.on('mouseup', this.handleTouchend);

        this.initCarousel();
        this.setDimensions();

        if (this.autoplay) {
            this.carousel.autoplay();
        }
    }

    ngAfterViewInit() {
        this.cellLength = this.getCellLength();
        this.dotsArr = Array(this.cellLength).fill(1);
        this.ref.detectChanges();
        this.carousel.queueCells();

        /* Start detecting changes in the DOM tree */
        this.detectDomChanges();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.width || changes.height || changes.images) {
            this.setDimensions();
            this.initCarousel();
            this.carousel.queueCells();
            this.ref.detectChanges();
        }
    }

    ngOnDestroy() {
        this.press.destroy();
        this.carousel.destroy();
    }

    initCarousel() {
        this.carousel = new Slider({
            element: this.elementRef.nativeElement.querySelector('.carousel-cells'),
            container: this.elementRef.nativeElement,
            images: this.images,
            cellWidth: this.getCellWidth(),
            loop: this.loop,
            autoplayInterval: this.autoplayInterval,
            overflowCellsLimit: this.overflowCellsLimit,
            visibleWidth: this.width,
            margin: this.margin,
            minSwipeDistance: this.minSwipeDistance,
            transitionDuration: this.transitionDuration,
            transitionTimingFunction: this.transitionTimingFunction,
            videoProperties: this.videoProperties
        });
    }

    detectDomChanges() {
        const observer = new MutationObserver((mutations) => {
            this.onDomChanges();
        });

        var config = {
            attributes: true,
            childList: true,
            characterData: true
        };
        observer.observe(this.elementRef.nativeElement, config);
    }

    onDomChanges() {
        this.cellLength = this.getCellLength();
        this.carousel.queueCells();
        this.ref.detectChanges();
    }

    setDimensions() {
        this.hostStyleHeight = this.height + 'px';
        this.hostStyleWidth = this.width + 'px';
    }

    getFile(index) {
        return this.carousel.getFile(index);
    }

    /* Touchstart */
    handleTouchstart = (event: any) => {
        //event.preventDefault();
        this.press.addEventListeners("mousemove", "handleMousemove");
        this.carousel.handleTouchstart(event);
        this.isMoving = true;
    }

    /* Touchmove */
    handleHorizontalSwipe = (event: any) => {
        event.preventDefault();
        this.carousel.handleHorizontalSwipe(event);
    }

    /* Touchend */
    handleTouchend = (event: any) => {
        const press = event.touches;
        this.carousel.handleTouchend(event);
        this.press.removeEventListeners("mousemove", "handleMousemove");
        this.isMoving = false;
    }

    handleTransitionendCellContainer(event) {
        this.carousel.handleSlideEnd();
    }

    toggleVideo(video) {
        event.preventDefault();
        if (this.videoProperties.noPlay) {
            return;
        }

        if (video.paused) {
            video.play();
            this.isVideoPlaying = true;
        } else {
            video.pause();
            this.isVideoPlaying = false;
        }

        this.ref.detectChanges();
    }

    getCurrentIndex() {
        return this.carousel.slideCounter;
    }

    getCellWidth() {
        let elementWidth = this.elementRef.nativeElement.clientWidth;

        if (this.cellsToShow) {
            let margin = this.cellsToShow > 1 ? this.margin : 0;
            let totalMargin = margin * (this.cellsToShow - 1);
            return (elementWidth - totalMargin) / this.cellsToShow;
        }

        if (this._cellWidth === '100%') {

            return elementWidth;
        } else {
            return this._cellWidth;
        }
    }

    next() {
        this.carousel.next(this.cellsToScroll);
        this.carousel.stopAutoplay();
        this.nextClick.emit();
    }

    prev() {
        this.carousel.prev(this.cellsToScroll);
        this.carousel.stopAutoplay();
        this.prevClick.emit();
    }

    select(index: number) {
        this.carousel.select(index);
    }

    isNextArrowDisabled() {
        const isDisabled = this.carousel.isNextArrowDisabled();
        this.isNextDisabled.emit(isDisabled);
        return isDisabled;
    }

    isPrevArrowDisabled() {
        const isDisabled = this.carousel.isPrevArrowDisabled();
        this.isPrevDisabled.emit(isDisabled);
        return isDisabled;
    }

    getCellLength() {
        if (this.images) {
            return this.images.length;
        } else {
            return this.cellsElement.children.length;
        }
    }
}