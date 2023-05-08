import { ImpulsType, Simulation } from "./simulation";

export class Rect {
    velocity: number;
    position: number;
    mass: number;
    simulation: Simulation;

    constructor(simulation: Simulation, position: number, velocity: number, mass: number) {
        this.position = position;
        this.velocity = velocity;
        this.mass = mass;
        this.simulation = simulation;
    }

    calculatePosition(fastestVelocity: number) {
        if(this.simulation.walls) {
            if(this.position <= 0) {
                if(this.simulation.impulsType == ImpulsType.ELASTIC) {
                    this.velocity = -this.velocity;
                }else {
                    this.velocity = 0;
                }
                this.position = 0;
            }
            if(this.position + 20 >= 400) {
                if(this.simulation.impulsType == ImpulsType.ELASTIC) {
                    this.velocity = -this.velocity;
                }else {
                    this.velocity = 0;
                }
                this.position = 380;
            }
        }
        for(var rect of this.simulation.rects) {
            if(rect == this) continue;
            if(this.position+20 >= rect.position && this.position <= rect.position+20) {
                if(this.simulation.sound) {
                    var audio = new Audio('../../assets/click.mp3');
                    audio.play();
                }
                this.position -= this.velocity / Math.abs(fastestVelocity);
                rect.position -= rect.velocity / Math.abs(fastestVelocity);
                if(this.simulation.impulsType == ImpulsType.ELASTIC) {
                    const thisvelocity = (this.mass*this.velocity-rect.mass*(this.velocity-2*rect.velocity))/(this.mass+rect.mass);
                    const rectvelocity = (this.mass*(2*this.velocity-rect.velocity)+rect.mass*rect.velocity)/(this.mass+rect.mass);
                    this.velocity = thisvelocity;
                    rect.velocity = rectvelocity;
                } else {
                    const newvelocity = (this.mass*this.velocity + rect.mass * rect.velocity)/(this.mass+rect.mass);
                    this.velocity = newvelocity;
                    rect.velocity = newvelocity;
                }
                return;
            }
        }
    }

}
