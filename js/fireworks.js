// 烟花特效核心逻辑
function createFireworks() {
  // 检查当前页面是否需要加载烟花特效
  const fireworksFlag = document.querySelector('meta[name="fireworks"]');
  if (!fireworksFlag) return;

  // 创建画布覆盖层
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none'; // 不影响页面交互
  canvas.style.zIndex = '9999'; // 确保在最上层
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  // 初始化画布大小
  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // 烟花粒子类
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = Math.random() * 2 + 1;
      this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
      this.velocity = {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10
      };
      this.gravity = 0.2;
      this.alpha = 1;
      this.fade = Math.random() * 0.03 + 0.01;
    }

    update() {
      this.velocity.y += this.gravity;
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.alpha -= this.fade;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  // 点击时创建烟花
  function createExplosion(x, y) {
    // 每次点击生成50-100个粒子
    const particleCount = Math.floor(Math.random() * 50) + 50;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(x, y));
    }
  }

  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // 绘制并更新所有粒子
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      
      // 移除透明度为0的粒子
      if (particles[i].alpha <= 0) {
        particles.splice(i, 1);
        i--;
      }
    }
    
    requestAnimationFrame(animate);
  }

  // 绑定点击事件
  document.addEventListener('click', (e) => {
    createExplosion(e.clientX, e.clientY);
  });

  // 启动动画
  animate();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', createFireworks);
