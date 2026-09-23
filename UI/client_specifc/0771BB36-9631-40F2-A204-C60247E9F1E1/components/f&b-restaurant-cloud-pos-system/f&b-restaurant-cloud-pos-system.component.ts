import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonFunctionService } from '../../../../src/app/services/shared_function/common-function.service';
import {Meta, Title} from "@angular/platform-browser";
import {MatDialog} from '@angular/material/dialog';
import { ModalRequestDemoComponent } from '../modal-request-demo/modal-request-demo.component';
import { RESTAURANT_ISLANDS } from '../industry-page/restaurant-islands';

@Component({
  selector: 'app-f&b-restaurant-cloud-pos-system',
  templateUrl: './f&b-restaurant-cloud-pos-system.component.html',
  styleUrls: ['../industry-page/industry-layout.css', './quick-service-desktop.css', '../industry-page/industry-overview.css', '../industry-page/industry-procedures.css', '../industry-page/industry-solutions.css', '../industry-page/industry-content-width.css']
})
export class CustomIndustryRestaurantComponent implements AfterViewInit, OnDestroy {
  openSolution: number | null = null;

  hoverSolution(index: number): void {
    if (window.matchMedia('(hover: hover)').matches) this.openSolution = index;
  }

  leaveSolution(event: Event): void {
    const host = event.currentTarget as HTMLElement;
    const next = (event as FocusEvent).relatedTarget as Node | null;
    if (next && host.contains(next)) return;
    if (event.type === 'mouseleave' && host.contains(document.activeElement)) return;
    this.openSolution = null;
  }

  readonly industryIslands = RESTAURANT_ISLANDS;
  readonly islandPreviews = Object.fromEntries(RESTAURANT_ISLANDS.map(island => {
    const points = Array.from((island.floorArea || '').matchAll(/([\d.]+)% ([\d.]+)%/g),
      match => [Number(match[1]) * 19.2, Number(match[2]) * 10.8]);
    return [island.id, { title: island.title, floorPoints: points.map(point => point.join(',')).join(' ') }];
  }));
  private readonly compactQuery = '(max-width: 991px), (max-width: 1366px) and (pointer: coarse)';
  isCompact = typeof window !== 'undefined' && window.matchMedia(this.compactQuery).matches;
  readonly procedureIndexes = [0, 1, 2, 3, 4];
  readonly procedureIslands = [
    ['dining', 'online', 'counter'], ['dining', 'counter', 'online'],
    ['kitchen'], ['management', 'counter'], ['management']
  ];
  restaurantModeActive = false;
  activeProcedure = 0;
  readonly procedureFocusIds = ['dining', 'counter', 'kitchen', 'counter', 'management'];
  activeQuickProcedure = 0;
  readonly quickFocusIds = ['counter', 'counter', 'kitchen', 'counter', 'management'];
  readonly quickProcedureIslands = [['counter', 'online'], ['counter'], ['kitchen'], ['counter'], ['management']];
  revealedRestaurant = -1;
  revealedQuick = -1;
  @ViewChildren('revealHeading') private revealHeadings!: QueryList<ElementRef<HTMLElement>>;
  private revealObserver?: IntersectionObserver;
  @ViewChild('restaurantMode') private restaurantMode!: ElementRef<HTMLElement>;
  @ViewChildren('procedureMarker') private procedureMarkers!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('quickProcedureMarker') private quickProcedureMarkers!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('procedureItem') private procedureItems!: QueryList<ElementRef<HTMLElement>>;
  private modeObserver?: IntersectionObserver;
  private procedureObserver?: IntersectionObserver;
  private compactLayout?: MediaQueryList;
  private observeProcedures = (): void => {
    this.isCompact = this.compactLayout?.matches ?? false;
    this.procedureObserver?.disconnect();
    this.procedureObserver = new IntersectionObserver(entries => {
      const entry = entries.find(candidate => candidate.isIntersecting);
      if (entry) this.zone.run(() => {
        const target = entry.target as HTMLElement;
        const index = Number(target.dataset['procedure']);
        if (target.dataset['mode'] === 'quick') this.activeQuickProcedure = index;
        else this.activeProcedure = index;
      });
    }, { rootMargin: `-${Math.round(window.innerHeight * .25)}px 0px -${Math.round(window.innerHeight * .65)}px 0px`, threshold: 0 });
    const targets = this.compactLayout?.matches ? this.procedureItems : this.procedureMarkers;
    targets.forEach(target => this.procedureObserver?.observe(target.nativeElement));
    if (!this.isCompact) this.quickProcedureMarkers.forEach(target => this.procedureObserver?.observe(target.nativeElement));
  };

  constructor(private titleService: Title,private commonFunctionService: CommonFunctionService,private meta: Meta,public dialog: MatDialog, private zone: NgZone) {
       this.titleService.setTitle("Cloud POS System for F&B Restaurant | APPZPOS POS System");
   };

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') return;
    this.modeObserver = new IntersectionObserver(([entry]) => {
      this.zone.run(() => this.restaurantModeActive = entry.isIntersecting);
    }, { rootMargin: '-96px 0px -35% 0px', threshold: 0 });
    this.modeObserver.observe(this.restaurantMode.nativeElement);
    this.compactLayout = window.matchMedia(this.compactQuery);
    this.compactLayout.addEventListener('change', this.observeProcedures);
    this.observeProcedures();
    this.observeReveals();
    window.addEventListener('resize', this.observeReveals);
    window.addEventListener('resize', this.observeProcedures);
  }

  private observeReveals = (): void => {
    this.revealObserver?.disconnect();
    const midpoint = Math.floor(window.innerHeight / 2);
    this.revealObserver = new IntersectionObserver(entries => {
      if (!this.isCompact) return;
      this.zone.run(() => entries.filter(entry => entry.isIntersecting).forEach(entry => {
        const heading = entry.target as HTMLElement;
        this.revealStep(heading.dataset['mode'] === 'quick', Number(heading.dataset['step']));
      }));
    }, { rootMargin: `-${midpoint}px 0px -${Math.max(0, window.innerHeight - midpoint - 2)}px 0px`, threshold: 0 });
    this.revealHeadings.forEach(heading => this.revealObserver?.observe(heading.nativeElement));
  };

  revealStep(quick: boolean, index: number): void {
    if (quick) { this.revealedQuick = index; this.activeQuickProcedure = index; }
    else this.revealedRestaurant = Math.max(this.revealedRestaurant, index);
  }

  goToProcedure(event: Event, index: number): void {
    event.preventDefault();
    this.activeProcedure = index;
    if (this.isCompact) this.revealStep(false, index);
    this.restaurantModeActive = true;
    if (!this.isCompact) {
      this.procedureMarkers.get(index)?.nativeElement.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center'
      });
    }
  }

  ngOnDestroy(): void {
    this.modeObserver?.disconnect();
    this.procedureObserver?.disconnect();
    this.revealObserver?.disconnect();
    window.removeEventListener('resize', this.observeReveals);
    window.removeEventListener('resize', this.observeProcedures);
    this.compactLayout?.removeEventListener('change', this.observeProcedures);
  }

  goToQuickProcedure(event: Event, index: number): void {
    event.preventDefault();
    this.activeQuickProcedure = index;
    if (!this.isCompact) this.quickProcedureMarkers.get(index)?.nativeElement.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center'
    });
  }

  BindURL_Image(FileName: string): string {
    return this.commonFunctionService.BindURL_Image(FileName);
  }

  ngOnInit() {
    this.meta.updateTag({
        name: 'description',
        content: 'Suitable for all F&B business - fast food & restaurant modes. Streamline orders, sales, transactions & delivery integration. WhatsApp us on +𝟔𝟓 𝟖𝟑𝟏𝟎 𝟗𝟔𝟑𝟏'
    });
 }
 openDialog(): void {
  const dialogRef = this.dialog.open(ModalRequestDemoComponent, {
    width: '600px',
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
  });
}
}
