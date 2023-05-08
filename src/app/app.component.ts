import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ImpulsType, RenderData, Simulation } from './classes/simulation';
import { faPlay, faPause, faVolumeHigh, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

export type RectData = {
  position: number;
  mass: number;
  velocity: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'PhysicsSimulation';
  rectDataList: RectData[] = [];
  simulation!: Simulation;
  walls: boolean = true;
  speed: number = 5;
  renderData: RenderData = RenderData.IMPULS;
  impulsType: ImpulsType = ImpulsType.ELASTIC;
  paused: boolean = false;
  faPause = faPause;
  faPlay = faPlay;
  faVolumeHigh = faVolumeHigh;
  faVolumeMute = faVolumeMute;
  sound: boolean = true;

  @ViewChild('canvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.restart();
  }

  setSound(sound: boolean) {
    this.sound = sound;
    if(this.simulation != null) {
      this.simulation.sound = sound;
    }
  }

  setWalls(walls: boolean) {
    this.walls = walls;
  }

  setSpeed(event: any) {
    this.speed = parseInt(event.target.value);
    if(this.simulation != null) {
      this.simulation.setSpeed(this.speed);
    }
  }

  pause() {
    if(this.simulation != undefined) {
      this.simulation.paused = true;
    }
    this.paused = true;
  }

  resume() {
    this.simulation.paused = false;
    this.paused = false;
  }

  restart() {
    if(this.simulation != undefined) {
      this.simulation.stop();
    }
    const context: CanvasRenderingContext2D | null = this.canvas.nativeElement.getContext('2d');
    if(context != null) {
      this.simulation = new Simulation(context, this.rectDataList, this.walls, this.speed, this.renderData, this.impulsType, this.sound);
    }
    this.paused = false;
  }

  setRenderData(event: any) {
    console.log(event.target.value);
    switch (event.target.value) {
      case "velocity":
        this.renderData = RenderData.VELOCITY;
        break;
      case "impuls":
        this.renderData = RenderData.IMPULS;
        break;
      case "energy":
        this.renderData = RenderData.KINENERGY;
        break;
      default:
        break;
    }
    if(this.simulation != null) {
      this.simulation.renderData = this.renderData;
    }
  }

  setImpulsType(event: any) {
    switch (event.target.value) {
      case "elastic":
        this.impulsType = ImpulsType.ELASTIC;
        break;
      case "unelastic":
        this.impulsType = ImpulsType.UNELASTIC;
        break;
      default:
        break;
    }
  }

  addObject() {
    this.rectDataList.push({"position":50+this.rectDataList.length*50,"mass":10,"velocity":5});
  }

  deleteRect(index: number) {
    this.rectDataList.splice(index, 1);
  }

  setPosition(index: number, event: any) {
    this.rectDataList[index].position = parseFloat(event.target.value);
  }

  setMass(index: number, event: any) {
    this.rectDataList[index].mass = parseFloat(event.target.value);
  }

  setVelocity(index: number, event: any) {
    this.rectDataList[index].velocity = parseFloat(event.target.value);
  }
}
