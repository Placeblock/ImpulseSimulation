import { RectData } from "../app.component";
import { Rect } from "./rect";

export enum RenderData {
    VELOCITY,
    IMPULS,
    KINENERGY
}
export enum ImpulsType {
    ELASTIC,
    UNELASTIC
}

export class Simulation {
    readonly chars: string = "ABCDEFGHIJKLMNOPQRSTUFVXYZ";
    canvas: CanvasRenderingContext2D;
    frametimer;
    rects: Rect[] = [];
    walls: boolean;
    canvaswidth: number = 400;
    canvasheight: number = 400;
    speed: number;
    renderData: RenderData;
    paused: boolean = false;
    impulsType: ImpulsType;
    sound: boolean;

    constructor(canvas: CanvasRenderingContext2D, rectDataList: RectData[], walls: boolean, speed: number, renderData: RenderData, impulsType: ImpulsType, sound: boolean) {
        this.canvas = canvas;
        this.walls = walls;
        this.speed = speed;
        this.renderData = renderData;
        this.impulsType = impulsType;
        this.sound = sound;
        console.log(rectDataList);

        for(var rectData of rectDataList) {
            this.rects.push(new Rect(this, rectData.position, rectData.velocity, rectData.mass));
        }
        this.frametimer = setInterval(this.frame.bind(this),1000/(this.speed*10));
    }

    setSpeed(speed: number) {
        this.stop();
        this.speed = speed;
        this.start();
    }

    frame() {
        if(this.paused) return;
        var fastestObject = undefined;
        for(var rect of this.rects) {
            if(fastestObject == undefined || Math.abs(rect.velocity) > Math.abs(fastestObject.velocity)) {
                fastestObject = rect;
            }
        }
        if(fastestObject != undefined) {
            for(var i = 0; i < Math.abs(fastestObject.velocity); i+=1) {
                for(var rect of this.rects) {
                    rect.position += (rect.velocity / Math.abs(fastestObject.velocity))/2;
                }
                for(var rect of this.rects) {
                    rect.calculatePosition(fastestObject.velocity);
                }
            }
        }
        this.render();
    }

    render() {
        this.canvas.fillStyle = "#fff";
        this.canvas.strokeStyle = "#fff";
        this.canvas.clearRect(0, 0, this.canvaswidth, this.canvasheight);
        this.canvas.beginPath();
        this.canvas.moveTo(0, 350.5);
        this.canvas.lineTo(400, 350.5);
        this.canvas.stroke();
        this.canvas.font = "20px Verdana";
        for(var i = 0; i < this.rects.length; i++) {
            const rect = this.rects[i];
            this.canvas.beginPath();
            this.canvas.rect(rect.position+0.5, 350-19.5, 20, 20);
            this.canvas.stroke();
            this.canvas.font = "10px Verdana";
            this.canvas.fillText(this.chars.charAt(i), rect.position+7.5, 350-5.5);
        }
        switch (this.renderData) {
            case RenderData.IMPULS:
                this.canvas.font = "20px Verdana";
                this.canvas.fillText("Impuls:", 20, 40);
                for(var i = 0; i < this.rects.length; i++) {
                    const rect = this.rects[i];
                    this.canvas.fillText(this.chars.charAt(i) + " ("+rect.mass.toString()+"kg): " + Math.round(rect.mass*rect.velocity*1000)/1000 + " kg*m/s", 20, 70+i*30);
                }
                break;
            case RenderData.VELOCITY:
                this.canvas.font = "20px Verdana";
                this.canvas.fillText("Velocity (Geschwindigkeit):", 20, 40);
                for(var i = 0; i < this.rects.length; i++) {
                    const rect = this.rects[i];
                    this.canvas.fillText(this.chars.charAt(i) + " ("+rect.mass.toString()+"kg): " + Math.round(rect.velocity*1000)/1000 + " m/s", 20, 70+i*30);
                }
                break;
            case RenderData.KINENERGY:
                this.canvas.font = "20px Verdana";
                this.canvas.fillText("Kinetic Energy (Kinetische Energie):", 20, 40);
                var allEnergy = 0;
                for(var i = 0; i < this.rects.length; i++) {
                    const rect = this.rects[i];
                    this.canvas.fillText(this.chars.charAt(i) + " ("+rect.mass.toString()+"kg): " + Math.round((0.5*rect.mass*(rect.velocity*rect.velocity))*1000)/1000 + " J", 20, 70+i*30);
                    allEnergy+=0.5*rect.mass*(rect.velocity*rect.velocity);
                }
                this.canvas.fillText("All (Gesamt): " + Math.round(allEnergy*1000)/1000 + " J", 20, 70+this.rects.length*30);
                break;
            default:
                break;
        }
    }

    start() {
        this.frametimer = setInterval(this.frame.bind(this),1000/(this.speed*10));
    }

    stop() {
        clearInterval(this.frametimer);
    }
}
