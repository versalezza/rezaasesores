/* REZA ASESORES | Ajustes de contacto en este archivo */
const WHATSAPP_NUMBER = '526565261298'; // Confirmar que este número recibe WhatsApp antes de publicar.
const WHATSAPP_GREETING = 'Hola, me gustaría recibir información sobre sus soluciones de seguros y fianzas.';

const header = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
let lastScrollY = window.scrollY;
let scrollTicking = false;

function closeMenu(){
  mainNav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded','false');
  menuToggle.setAttribute('aria-label','Abrir menú');
  menuToggle.innerHTML = '<i data-lucide="menu"></i>';
  if(window.lucide) lucide.createIcons();
}
menuToggle.addEventListener('click',()=>{
  const open = mainNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded',String(open));
  menuToggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
  menuToggle.innerHTML = open ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
  if(window.lucide) lucide.createIcons();
});
mainNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('click',e=>{if(mainNav.classList.contains('is-open')&&!mainNav.contains(e.target)&&!menuToggle.contains(e.target))closeMenu();});

// La barra se oculta al bajar y reaparece al subir, para liberar espacio de lectura.
window.addEventListener('scroll',()=>{
  if(scrollTicking)return;
  scrollTicking=true;
  window.requestAnimationFrame(()=>{
    const currentY=window.scrollY;
    header.classList.toggle('scrolled',currentY>12);
    if(!mainNav.classList.contains('is-open')){
      if(currentY>140 && currentY>lastScrollY+4) header.classList.add('is-hidden');
      else if(currentY<lastScrollY-4 || currentY<80) header.classList.remove('is-hidden');
    }
    lastScrollY=currentY;
    scrollTicking=false;
  });
},{passive:true});

// Animaciones de entrada al aparecer cada bloque.
const revealObserver=new IntersectionObserver((entries,observer)=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});
},{threshold:.12,rootMargin:'0px 0px -35px 0px'});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

// Navegación activa según la sección visible.
const sections=[...document.querySelectorAll('main section[id]')];
const navLinks=[...document.querySelectorAll('.nav-link')];
const sectionObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${entry.target.id}`));
    }
  });
},{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(section=>sectionObserver.observe(section));

// Enlaces flotantes y CTAs abren una conversación de WhatsApp.
function whatsappUrl(message=WHATSAPP_GREETING){
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
const whatsappFloat=document.getElementById('whatsappFloat');
whatsappFloat.href=whatsappUrl();
whatsappFloat.target='_blank';
document.querySelectorAll('[data-interest]').forEach(link=>{
  link.addEventListener('click',()=>{
    const interest=link.dataset.interest;
    sessionStorage.setItem('rezaInterest',interest);
  });
});

// El formulario prepara un mensaje estructurado y lo entrega a WhatsApp.
const contactForm=document.getElementById('contactForm');
const interestSelect=contactForm.querySelector('[name="interes"]');
const savedInterest=sessionStorage.getItem('rezaInterest');
if(savedInterest){interestSelect.value=savedInterest;sessionStorage.removeItem('rezaInterest');}
contactForm.addEventListener('submit',event=>{
  event.preventDefault();
  if(!contactForm.reportValidity())return;
  const data=new FormData(contactForm);
  const name=data.get('nombre').trim();
  const phone=data.get('telefono').trim();
  const email=data.get('correo').trim()||'No proporcionado';
  const interest=data.get('interes');
  const message=data.get('mensaje').trim()||'Sin comentarios adicionales';
  const text=`Hola, REZA ASESORES. Quiero solicitar información.\n\nNombre: ${name}\nTeléfono: ${phone}\nCorreo: ${email}\nMe interesa: ${interest}\nMensaje: ${message}`;
  document.getElementById('formFeedback').textContent='Abriendo WhatsApp para que puedas enviar tu solicitud…';
  window.open(whatsappUrl(text),'_blank','noopener,noreferrer');
});

document.getElementById('year').textContent=new Date().getFullYear();
if(window.lucide)lucide.createIcons();
