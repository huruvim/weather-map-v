import { Map } from "maplibre-gl";
import mlJson from "./ml.json";
import { styleLoaded } from "./styleLoaded";

export class RouteMap {
  constructor({ container, center, zoom }) {
    this.container = container;
    this.center = center;
    this.zoom = zoom;
    this.routes = [];
    this.map = null;
    this._init();
  }

  _init() {
    this.map = new Map({
      container: this.container,
      style: mlJson,
      center: this.center,
      zoom: this.zoom
    });
  }

  addRoute({ data, id, styles }) {
    const { color = 'rgba(40,255,202,0.8)' } = styles;
    styleLoaded(this.map, () => {
      const sourceId = `route_check_${id}`
      const layerId = `route_layer_${id}`
      const layerSecondId = `route_layer_2_${id}`
      if (!this.map.getSource(sourceId)) {
        this.map.addSource(sourceId, {
          type: 'geojson',
          data,
        });
      }
      this.map.addLayer({
        id: layerId,
        type: 'circle',
        source: sourceId,
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-opacity': 0.8,
          'circle-radius': 5,
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.8,
          'circle-stroke-color': '#ffffff',
          'circle-color': color
        }
      });
      this.map.addLayer({
        'id': layerSecondId,
        'type': 'line',
        'source': sourceId,
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': color,
          'line-width': 4
        }
      });
    });
    console.log('route did draw')
  }

  removeRoute(id) {
    const sourceId = `route_check_${id}`
    const layerId = `route_layer_${id}`
    const layerSecondId = `route_layer_2_${id}`
    styleLoaded(this.map, () => {
      if (this.map.getSource(sourceId)) {
        if (this.map.getLayer(layerId)) {
          this.map.removeLayer(layerId)
        }
        if (this.map.getLayer(layerSecondId)) {
          this.map.removeLayer(layerSecondId)
        }
        this.map.removeSource(sourceId)
      }
    })

    console.log('should remove route with id:', id);
    console.log('route with id was removed:', id);
  }
}