import { RETAIL_ISLANDS } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/industry-page/retail-islands';
import { BEAUTY_ISLANDS } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/industry-page/beauty-islands';
import { IndustryIslandsComponent } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/industry-page/industry-page.component';
import { RESTAURANT_ISLANDS } from '../../../../../client_specifc/0771BB36-9631-40F2-A204-C60247E9F1E1/components/industry-page/restaurant-islands';

describe('Restaurant island camera', () => {
  it('fits each focused island including its labels inside the frame', () => {
    const component = new IndustryIslandsComponent();
    component.islands = RESTAURANT_ISLANDS;
    for (const island of RESTAURANT_ISLANDS) {
      component.focusId = island.id;
      const camera = component.camera;
      expect(camera.scale).toBeGreaterThan(1);
      expect(camera.scale).toBeLessThanOrEqual(2);
      for (const point of island.hitArea.matchAll(/([\d.]+)% ([\d.]+)%/g)) {
        const x = 50 + (Number(point[1]) - camera.x) * camera.scale;
        const y = 50 + (Number(point[2]) - camera.y) * camera.scale;
        expect(x).toBeGreaterThanOrEqual(5);
        expect(x).toBeLessThanOrEqual(95);
        expect(y).toBeGreaterThanOrEqual(5);
        expect(y).toBeLessThanOrEqual(95);
      }
    }
  });

  it('returns to the full diagram outside Restaurant Mode', () => {
    const component = new IndustryIslandsComponent();
    component.islands = RESTAURANT_ISLANDS;
    component.focusId = 'kitchen';
    expect(component.camera.scale).toBeGreaterThan(1);
    component.focusId = '';
    expect(component.camera).toEqual({ x: 50, y: 50, scale: 1 });
    component.focusId = 'unknown';
    expect(component.camera.scale).toBe(1);
  });
});

describe('Industry-specific island cameras', () => {
  for (const islands of [RETAIL_ISLANDS, BEAUTY_ISLANDS]) {
    it('focuses each original industry island and resets manual focus on workflow changes', () => {
      const component = new IndustryIslandsComponent();
      component.islands = islands;
      component.focusOnSelect = true;
      for (const island of islands) {
        component.select(island);
        expect(component.cameraId).toBe(island.id);
        const camera = component.camera;
        expect(camera.scale).toBeGreaterThan(1);
        for (const point of island.hitArea.matchAll(/([\d.]+)% ([\d.]+)%/g)) {
          expect(50 + (Number(point[1]) - camera.x) * camera.scale).toBeGreaterThanOrEqual(5);
          expect(50 + (Number(point[1]) - camera.x) * camera.scale).toBeLessThanOrEqual(95);
          expect(50 + (Number(point[2]) - camera.y) * camera.scale).toBeGreaterThanOrEqual(5);
          expect(50 + (Number(point[2]) - camera.y) * camera.scale).toBeLessThanOrEqual(95);
        }
      }
      component.focusId = islands[0].id;
      component.ngOnChanges();
      expect(component.cameraId).toBe(islands[0].id);
      component.interactive = false;
      component.select(islands[1]);
      expect(component.selectedId).toBe('');
    });
  }
});
