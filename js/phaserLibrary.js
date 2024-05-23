class Binh extends Phaser.Scene{


	preload(){
	}
	spinYoyo(sprite,start,des,speed)
	{
		sprite.angle =start;
		var timedEventsss = this.time.addEvent({ delay: 10, callback: loopss, callbackScope: this, loop: true });
		function loopss()
		{
			sprite.angle += speed;

			if (sprite.angle >= des || sprite.angle <=start)
			{ 
				speed = -speed
			}
		}

	}
    spin(sprite,start,des,speed)
	{
		sprite.angle =start;
		var timedEventsss = this.time.addEvent({ delay: 10, callback: loopss, callbackScope: this, loop: true });
		function loopss()
		{
			sprite.angle += speed;

			// if (sprite.angle >= des)
			// { 
			// 	this.time.removeEvent(timedEventsss)
			// }
		}

	}
	alphayoyo(sprite,start,des,speed)
	{
		sprite.alpha = start ;
		des = des - 0.00001;
		start = start + 0.00005;
		var timedEventsss = this.time.addEvent({ delay: 10, callback: loopssss, callbackScope: this, loop: 1 });
		function loopssss()
		{
			sprite.alpha += speed;
			
			if ((sprite.alpha > start) || (sprite.alpha < des))
			{ 

				speed = -speed
			}

		}

	}



	
	zoomscale(sprite,percent,duration)
	{
		var speed = duration * 0.01
		var a= percent ;
		if (percent > sprite.scale)
		{
			var ma = this.time.addEvent({ delay: 20, callback: zoomloops, callbackScope: this, loop: true });
			function zoomloops()
			{
				sprite.scale +=speed;
				if (sprite.scale >= a )
				{
					ma.remove(false)
				}			
			}

		}
		else
		{
			var ma = this.time.addEvent({ delay: 20, callback: zoomloops, callbackScope: this, loop: true });
			function zoomloops()
			{
				sprite.scale -=speed;
				if (sprite.scale <= a )
				{
					ma.remove(false)
				}			
			}
		}
		
	}




	glidetoXY(sprite,posX,posY,dur)
	{
		this.tweens.add({
			targets: sprite,
			x: posX, 
			y: posY,
			ease: 'sine.inout',
			duration: dur,
		});
	}

	glideyoyoXY(sprite,posX,posY,dur)
	{
		this.tweens.add({
			targets: sprite,
			x: posX,
			y: posY,
			ease: 'sine.inout',
			duration: dur,
			repeat: -1,
			yoyo: true,
		});

	}
    //Start a new scene but with 1.5s delay
    //Scene: string
    startNewScene(scene){
        this.time.delayedCall(2000, ()=>{
            this.scene.start(scene);
        })
    }
}
