const images = ['bg1.jpg', 'bg2.jpg', 'bg3.jpg', 'bg4.jpg', 'bg5.jpg', 'bg6.jpg', 'bg7.jpg', 'bg8.jpg', 'bg9.jpg'];
const eventsUrl = 'https://www.pgm.gent/data/gentsefeesten/events.json';
const categoriesUrl = 'https://www.pgm.gent/data/gentsefeesten/categories.json';
const dutchDayNames = ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'];
const dutchDayNamesShort = ['Zo','Ma','Di','Wo','Do','Vr','Za'];

(() => {
    const app = {
        initialize() {
           this.getDataAPICategory();
           this.generateRandomBackground();
           this.modalBurger();
           ;
          
    
        },
        getDataAPICategory() {
            fetch(categoriesUrl)
            .then((response) =>response.json())
            .then((json)=>{
                this.category = json;
                this.getDataAPIEvent();
                this.createAllCategories(this.category);
                
            })
            .catch((e)=>console.log(e));
        }, 
        getDataAPIEvent() {
            fetch(eventsUrl)
            .then((response) =>response.json())
            .then((json)=>{
                this.event = json;
                this.createEvents(this.event);
                this.createModalDays(this.event);
                this. createDetail(this.event)
                this.createCategory(this.category, this.event);
                this.createAnotherEvents(this.event);
                this.createDayEvents(this.event);
                this.dayTogleEvents();
                
        
            })
            .catch((e)=>console.log(e));
        },
        generateRandomBackground() {
            const headerBg= document.querySelector('.header__bg');
            const randomBg = images[Math.floor(Math.random() * images.length)];
            headerBg.style.background = `url('static/media/${randomBg}')center center / cover no-repeat rgb(0, 0, 0)`;
        },
        modalBurger() {
            const burger = document.querySelector('.burger');
            const modalWindow = document.querySelector('.my-modal');
            const close = document.querySelector('.close');
            const less = document.querySelector('.less');
            const more = document.querySelector('.more');
            const program = document.querySelector('.program');
            const list = document.querySelector('.program ul');
            burger.addEventListener('click', function() {
                modalWindow.style.display = 'block';
            });
            close.addEventListener('click', function() {
                close.style.transform = 'rotate(180deg)';
                setTimeout(function() {
                    modalWindow.style.display = 'none';
                }, 1000);
            });
            program.addEventListener("click", function() {
                if(more.style.display === 'none') {
                    less.style.display = 'none';
                    more.style.display ='inline-block';
                    list.style.display = 'block';
                }else {
                    less.style.display = 'inline-block';
                    more.style.display ='none';
                    list.style.display = 'none';
                }
            });
            
        },
        createEvents(data) {
            const eventsConteiner = document.querySelector('.events__main-js');

            if(eventsConteiner) {
                const newData = [];
                for (let i = 0; i < data.length; i++) {
                    const random = Math.floor(Math.random() * (data.length-1));
                    const item = data[random];
                    if(item.image && item.image.thumb && item.image.full && item.url){
                        newData.push(item);
                    }
                    if(newData.length >= 3){
                        break;
                    }
                }
                let str = '';
                for(let i = 0;i < newData.length;i++) {
                    const currentItem = newData[i];                
                    if(currentItem && currentItem.image && currentItem.image.thumb && currentItem.image.full&& currentItem.url) {
                        const myDay = new Date(`July ${currentItem.day}, 2019 23:15:30`);
                        str += ` <a href="detail.html?dag=${currentItem.day}&slug=${currentItem.slug}" class="events__link detail-js" data-type="${currentItem.id}" data-day="${currentItem.day}" href="#">
                                    <div class="bg" style="background-image: url(${currentItem.image.thumb})"> <span class="date date-js">${dutchDayNamesShort [myDay.getDay()]} ${currentItem.day} Jul ${currentItem.start} u</span></div>
                                    <div class="events__content">
                                        <h2>${currentItem.title}</h2>
                                        <div class="place">${currentItem.location}</div>
                                    </div>
                                </a>`;
                    }
    
                }
                eventsConteiner.innerHTML = str;
            }
        },
        createModalDays(data) {
            const ul = document.querySelector('.program ul');
            const ulDay = document.querySelector('.days-js');
            const ulDayInside = document.querySelector('.days__inside-js');
            const uniqeDays = [];
            data.forEach((e) => {
                if(!uniqeDays.includes(e.day) && e.day >= "19" && e.day <= "28") {
                    uniqeDays.push(e.day);
                }
                uniqeDays.sort();
            });
            let strAside = "";
            let str = "";
            let strInside = "";
            if(ulDay || ul) {
                uniqeDays.forEach((u) => {
                    const myDays = new Date(`July ${u}, 2019 23:15:30`);
                {
                    str += `<li class="modal-days"><a href="dag.html?dag=${u}"><span class="modal-day-of__week day-js">${dutchDayNames[myDays.getDay()]}</span><span class="modal-day-of__mounth"> ${u} Juli</span></a></li>`;
                    strAside += `<li class="days"><a href="dag.html?dag=${u}"><span class="day-of__week">${dutchDayNamesShort[myDays.getDay()]}</span><span class="day-of__mounth">${u} Juli</span></a></li>`;
                }
                });
                    ul.innerHTML = str;
                    ulDay.innerHTML = strAside;
                    const program = document.createElement('li');
                    program.classList.add('modal-days');
                    const a = document.createElement('a');
                    a.textContent = "Programma";
                    program.appendChild(a);
                    ul.appendChild(program);
            
            }if(ulDayInside) {
                uniqeDays.forEach((u) => {
                    const myDays = new Date(`July ${u}, 2019 23:15:30`);
                    strInside += `<li class="inside__day"><a href="dag.html?dag=${u}"><span class="inside__day-of__week day-js">${dutchDayNamesShort[myDays.getDay()]}</span><span class="inside__day-of__mounth">${u} Juli</span></a></li>`;
            });
                ulDayInside.innerHTML = strInside;
        }
        
        },
        createCategory(category, event) {
            const viewLikeImage = document.querySelector('.choice-img');
            const viewLikeList = document.querySelector('.choice-list');
            const categoryAll = document.querySelector('.category__all');
            const url = new URLSearchParams(window.location.search);
            const elementUrlDay = url.get('dag');
            if(categoryAll && elementUrlDay) {
                const html = category.map((c) => {
                        
                        const filterEvent = event.filter((e) => {
                            
                            if(elementUrlDay == e.day) {

                            return e.category.indexOf(c) > -1;
                            }
                        });
                    
                        const sorted = filterEvent.sort((a, b) => a.start.localeCompare(b.start));
                        const listCategory = sorted.map((l) => {
                            if(l.image && l.image.thumb && l.image.full){
                            // return `<li><a href="detail.html?dag=${l.day}&slug=${l.slug}"><span>${l.start}</span><span>${l.title}</span><span>${l.location}</span></a></li>`;
                            return `<a href="detail.html?dag=${l.day}&slug=${l.slug}" class="events__link detail-js image-item-js" data-type="${l.id}" data-day="${l.day}" href="#">
                            <div class="bg" style="background-image: url(${l.image.thumb})"><span class="date date-js">${l.start} u</span></div>
                            <div class="events__content">
                                <h2>${l.title}</h2>
                                <div class="place">${l.location}</div>
                            </div>
                        </a> <div class="list-item"><a href="detail.html?dag=${l.day}&slug=${l.slug}"><span>${l.start}</span><span>${l.title}</span><span>${l.location}</span></a></div>`
                        
                        }
                        }).join('');
                        return `<h2 class="header-for-list" id = "${c}">${c} <a class="arrow-up" href="#toTop"><svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 7.31667L1.88533 9.21467L6.00267 5.09733L6.00267 16H8.664V5.09733L12.7813 9.21467L14.6667 7.31667L7.33333 0L0 7.31667Z" fill="black"/>
                        </svg></a>
                        </h2>
                        <div class="events container event__day-js">${listCategory}</div>`;
                    }).join('');
                categoryAll.innerHTML = html;
            

                
            

            }
        },
        createAllCategories(category) {
            const categoryList = document.querySelector('.category ul');
            if(categoryList){
                const str = category.map((c) => {
                    return `<li><a href="#${c}">${c}</a></li>`;
                }).join('');
                categoryList.innerHTML = str;
            }
           
        },
        createDetail(events) {
                const detailContent = document.querySelector('.about-js');
                const url = new URLSearchParams(window.location.search);
                const elementUrlDay = url.get('dag');
                const elementUrlSlug = url.get('slug');
                const arr = [];
                if(elementUrlDay && elementUrlSlug) {
                    events.forEach((e) => {
                        if(e.day == elementUrlDay && e.slug == elementUrlSlug && e.image && e.image.full) {`+`
                            arr.push(e);
                        }
                             
                        });  

                const str = arr.map((e) => {
                     
                    return `  <div class="about-info">
                    <div class="high">
                        <img src="${e.image.full}" alt="image">
                    </div>
                    <div class="low">
                        <h1>${e.title}</h1>
                        <a class="low__location">
                            <svg width="12" height="17" viewBox="0 0 12 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.66667 0C2.69308 0 0 2.41046 0 5.38475C0 8.35833 2.45721 11.9085 5.66667 17C8.87612 11.9085 11.3333 8.35833 11.3333 5.38475C11.3333 2.41046 8.64096 0 5.66667 0ZM5.66667 7.79167C4.49296 7.79167 3.54167 6.84037 3.54167 5.66667C3.54167 4.49296 4.49296 3.54167 5.66667 3.54167C6.84037 3.54167 7.79167 4.49296 7.79167 5.66667C7.79167 6.84037 6.84037 7.79167 5.66667 7.79167Z" fill="black"/>
                            </svg>
                            <span class="location-js">${e.location}</span>
                        </a>
                        <div class="low__date">
                            <span>${e.day_of_week} ${e.day} Juli - ${e.start} u. > ${e.end} u.</span>
                        </div>
                        <div class="about__descr-inside">
                            <p>
                                ${e.description}
                            </p>
                            <div class="about__more">
                                <div>
                                    <span>Website</span> <a href=${e.url}>${e.url}</a>
                                    <span>Organisator</span>  <a href="#">${e.organizer}</a>
                                    <span>Categorieën</span> <a href="#">${e.category}</a>
                                </div>
                                <svg class="chair" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.4114 14.3128L18.9384 15.3779C19.0831 15.6711 18.9644 16.0274 18.6712 16.1721L16.2403 17.3931C15.6465 17.69 14.9191 17.4376 14.6371 16.8327L12.3101 11.8746H7.12555C6.53547 11.8746 6.03445 11.4404 5.9491 10.854C4.69099 2.05118 4.76521 2.59672 4.75037 2.37405C4.75037 1.02319 5.87487 -0.0604677 7.2406 0.00262181C8.47644 0.0582891 9.46734 1.07514 9.50074 2.31096C9.53414 3.53193 8.63973 4.55249 7.47441 4.72321L7.64513 5.93675H12.4697C12.7963 5.93675 13.0635 6.20395 13.0635 6.53053V7.7181C13.0635 8.04468 12.7963 8.31189 12.4697 8.31189H7.98656L8.15727 9.49946H13.0635C13.5237 9.49946 13.9431 9.76666 14.1398 10.1823L16.2737 14.7248L17.6172 14.0456C17.9104 13.8972 18.2667 14.0196 18.4114 14.3128ZM11.5568 13.0622H10.6475C10.358 15.0736 8.62489 16.6249 6.53176 16.6249C4.23822 16.6249 2.37518 14.7619 2.37518 12.4684C2.37518 10.9282 3.21763 9.5811 4.4646 8.86114C4.32729 7.89624 4.21224 7.0835 4.11204 6.40064C1.70716 7.36554 0 9.72212 0 12.4684C0 16.0682 2.93187 19 6.53176 19C9.20013 19 11.4974 17.3931 12.5105 15.0959L11.5568 13.0622Z" fill="black"/>
                                </svg>
                            </div>
                            <div class="about__social">
                                <div> <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path class="white" d="M17.9442 3.98749C17.9569 4.16248 17.9569 4.33751 17.9569 4.5125C17.9569 9.84997 13.8326 16 6.29444 16C3.97209 16 1.81473 15.3375 0 14.1875C0.329962 14.225 0.64719 14.2375 0.989848 14.2375C2.90607 14.2375 4.67006 13.6 6.0787 12.5125C4.27666 12.475 2.7665 11.3125 2.24618 9.7125C2.50001 9.74997 2.7538 9.77498 3.02032 9.77498C3.38833 9.77498 3.75638 9.72496 4.099 9.63751C2.22083 9.26247 0.812152 7.63749 0.812152 5.67499V5.62501C1.35782 5.92501 1.99239 6.11251 2.66493 6.13748C1.56087 5.41247 0.837542 4.17498 0.837542 2.77497C0.837542 2.02499 1.04055 1.33749 1.3959 0.737481C3.41369 3.18748 6.4467 4.78745 9.8477 4.96248C9.78426 4.66248 9.74617 4.35001 9.74617 4.03751C9.74617 1.81248 11.5736 0 13.8452 0C15.0254 0 16.0914 0.487499 16.8401 1.275C17.7665 1.10001 18.6548 0.762491 19.4416 0.300002C19.137 1.23752 18.4898 2.02502 17.6396 2.52499C18.4645 2.43753 19.264 2.21248 20 1.90001C19.4417 2.69998 18.7437 3.41245 17.9442 3.98749Z" fill="black"/>
                                     </svg>
                                </div>
                                <div>
                                    <svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path class="white" d="M10.2792 11.8125L10.8496 8.01199H7.28306V5.54572C7.28306 4.50598 7.78127 3.49248 9.3786 3.49248H11V0.256758C11 0.256758 9.52863 0 8.12184 0C5.18471 0 3.26486 1.82027 3.26486 5.11547V8.01199H0V11.8125H3.26486V21H7.28306V11.8125H10.2792Z" fill="black"/>
                                    </svg>
                                </div>
                                <div>
                                    <svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path class="white" d="M8.36719 0.266602C4.15898 0.266602 0 3.07207 0 7.6125C0 10.5 1.62422 12.1406 2.60859 12.1406C3.01465 12.1406 3.24844 11.0086 3.24844 10.6887C3.24844 10.3072 2.27637 9.49512 2.27637 7.90781C2.27637 4.61016 4.78652 2.27227 8.03496 2.27227C10.8281 2.27227 12.8953 3.85957 12.8953 6.77578C12.8953 8.95371 12.0217 13.0389 9.1916 13.0389C8.17031 13.0389 7.29668 12.3006 7.29668 11.2424C7.29668 9.69199 8.37949 8.19082 8.37949 6.59121C8.37949 3.87598 4.52813 4.36816 4.52813 7.64941C4.52813 8.33848 4.61426 9.10137 4.92188 9.72891C4.35586 12.1652 3.19922 15.7951 3.19922 18.3053C3.19922 19.0805 3.30996 19.8434 3.38379 20.6186C3.52324 20.7744 3.45352 20.758 3.6668 20.6801C5.73398 17.85 5.66016 17.2963 6.59531 13.5926C7.0998 14.5523 8.4041 15.0691 9.4377 15.0691C13.7936 15.0691 15.75 10.824 15.75 6.99727C15.75 2.92441 12.2309 0.266602 8.36719 0.266602Z" fill="black"/>
                                    </svg>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
                <div class="about__descr">
                    <p>
                    ${e.description}
                    </p>
                    <div class="about__more">
                        <div>
                        <span>Website</span> <a href=${e.url}>${e.url}</a>
                        <span>Organisator</span>  <a href="#">${e.organizer}</a>
                        <span>Categorieën</span> <a href="#">${e.category}</a>
                    </div>
                    <svg class="chair-inside" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.4114 14.3128L18.9384 15.3779C19.0831 15.6711 18.9644 16.0274 18.6712 16.1721L16.2403 17.3931C15.6465 17.69 14.9191 17.4376 14.6371 16.8327L12.3101 11.8746H7.12555C6.53547 11.8746 6.03445 11.4404 5.9491 10.854C4.69099 2.05118 4.76521 2.59672 4.75037 2.37405C4.75037 1.02319 5.87487 -0.0604677 7.2406 0.00262181C8.47644 0.0582891 9.46734 1.07514 9.50074 2.31096C9.53414 3.53193 8.63973 4.55249 7.47441 4.72321L7.64513 5.93675H12.4697C12.7963 5.93675 13.0635 6.20395 13.0635 6.53053V7.7181C13.0635 8.04468 12.7963 8.31189 12.4697 8.31189H7.98656L8.15727 9.49946H13.0635C13.5237 9.49946 13.9431 9.76666 14.1398 10.1823L16.2737 14.7248L17.6172 14.0456C17.9104 13.8972 18.2667 14.0196 18.4114 14.3128ZM11.5568 13.0622H10.6475C10.358 15.0736 8.62489 16.6249 6.53176 16.6249C4.23822 16.6249 2.37518 14.7619 2.37518 12.4684C2.37518 10.9282 3.21763 9.5811 4.4646 8.86114C4.32729 7.89624 4.21224 7.0835 4.11204 6.40064C1.70716 7.36554 0 9.72212 0 12.4684C0 16.0682 2.93187 19 6.53176 19C9.20013 19 11.4974 17.3931 12.5105 15.0959L11.5568 13.0622Z" fill="black"/>
                    </svg>
                    <div class="about__social">
                        <div> <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path class="white" d="M17.9442 3.98749C17.9569 4.16248 17.9569 4.33751 17.9569 4.5125C17.9569 9.84997 13.8326 16 6.29444 16C3.97209 16 1.81473 15.3375 0 14.1875C0.329962 14.225 0.64719 14.2375 0.989848 14.2375C2.90607 14.2375 4.67006 13.6 6.0787 12.5125C4.27666 12.475 2.7665 11.3125 2.24618 9.7125C2.50001 9.74997 2.7538 9.77498 3.02032 9.77498C3.38833 9.77498 3.75638 9.72496 4.099 9.63751C2.22083 9.26247 0.812152 7.63749 0.812152 5.67499V5.62501C1.35782 5.92501 1.99239 6.11251 2.66493 6.13748C1.56087 5.41247 0.837542 4.17498 0.837542 2.77497C0.837542 2.02499 1.04055 1.33749 1.3959 0.737481C3.41369 3.18748 6.4467 4.78745 9.8477 4.96248C9.78426 4.66248 9.74617 4.35001 9.74617 4.03751C9.74617 1.81248 11.5736 0 13.8452 0C15.0254 0 16.0914 0.487499 16.8401 1.275C17.7665 1.10001 18.6548 0.762491 19.4416 0.300002C19.137 1.23752 18.4898 2.02502 17.6396 2.52499C18.4645 2.43753 19.264 2.21248 20 1.90001C19.4417 2.69998 18.7437 3.41245 17.9442 3.98749Z" fill="black"/>
                             </svg>
                        </div>
                        <div>
                            <svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path class="white" d="M10.2792 11.8125L10.8496 8.01199H7.28306V5.54572C7.28306 4.50598 7.78127 3.49248 9.3786 3.49248H11V0.256758C11 0.256758 9.52863 0 8.12184 0C5.18471 0 3.26486 1.82027 3.26486 5.11547V8.01199H0V11.8125H3.26486V21H7.28306V11.8125H10.2792Z" fill="black"/>
                            </svg>
                        </div>
                        <div>
                            <svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path class="white" d="M8.36719 0.266602C4.15898 0.266602 0 3.07207 0 7.6125C0 10.5 1.62422 12.1406 2.60859 12.1406C3.01465 12.1406 3.24844 11.0086 3.24844 10.6887C3.24844 10.3072 2.27637 9.49512 2.27637 7.90781C2.27637 4.61016 4.78652 2.27227 8.03496 2.27227C10.8281 2.27227 12.8953 3.85957 12.8953 6.77578C12.8953 8.95371 12.0217 13.0389 9.1916 13.0389C8.17031 13.0389 7.29668 12.3006 7.29668 11.2424C7.29668 9.69199 8.37949 8.19082 8.37949 6.59121C8.37949 3.87598 4.52813 4.36816 4.52813 7.64941C4.52813 8.33848 4.61426 9.10137 4.92188 9.72891C4.35586 12.1652 3.19922 15.7951 3.19922 18.3053C3.19922 19.0805 3.30996 19.8434 3.38379 20.6186C3.52324 20.7744 3.45352 20.758 3.6668 20.6801C5.73398 17.85 5.66016 17.2963 6.59531 13.5926C7.0998 14.5523 8.4041 15.0691 9.4377 15.0691C13.7936 15.0691 15.75 10.824 15.75 6.99727C15.75 2.92441 12.2309 0.266602 8.36719 0.266602Z" fill="black"/>
                            </svg>
                        </div> 
                    </div>
                </div>`;
                
                }).join('');    
                detailContent.innerHTML = str;  
                const chair = document.querySelector('.chair');
                const chairInside = document.querySelector('.chair-inside')
                console.log(chair);
                arr.map((e) => {
                    if(e.wheelchair_accessible == true) {
                        chair.classList.remove('hidden');
                        chair.classList.add('active');
                        chairInside.classList.add('active');
                    }else {
                        chair.classList.remove('active');
                        chair.classList.add('hidden'); 
                        chairInside.classList.remove('active');
                        chairInside.classList.add('hidden');
                    }
                });
                }
        },
        createAnotherEvents(events) {
            const location = document.querySelector('.location-js');
            const another = document.querySelector('.another ul');
            const url = new URLSearchParams(window.location.search);
            const elementUrlDay = url.get('dag');
            const elementUrlSlug = url.get('slug');
            let str = "";
            const arr = [];
            if(elementUrlDay && elementUrlSlug) {  
                for (let i = 0; i < events.length; i++) {
                    const random = Math.floor(Math.random() * (events.length-1));
                    const item = events[random];
                    if(item.day == elementUrlDay && item.location == location.innerText){
                        arr.push(item);
                    }
                    if(arr.length >= 4){
                        break;
                    }
                }
                arr.forEach((e) => {
                    str +=`<li>
                                <a href="detail.html?dag=${e.day}&slug=${e.slug}">
                                    <span class="another-time-js">${e.start} u</span>
                                    <span  class="another-title-js">${e.title}</span>
                                    <span  class="another-location-js">${e.location}</span>
                                </a>
                          </li>`
                });
                another.innerHTML = str;
            }
        },
        createDayEvents(events) {
            const eventsConteiner = document.querySelector('.event__day-js');
            const url = new URLSearchParams(window.location.search);
            const elementUrlDay = url.get('dag');
            const newData = [];
            if(elementUrlDay && eventsConteiner) {
                for (let i = 0; i < events.length; i++) {
                    const random = Math.floor(Math.random() * (events.length-1));
                    const item = events[random];
                    if(item.image && item.image.thumb && item.url && item.day == elementUrlDay){
                        newData.push(item);
                    }
                    if(newData.length >= 3){
                        break;
                    }
                }
                let str = '';
                for(let i = 0;i < newData.length;i++) {
                    const currentItem = newData[i];                
                    if(currentItem && currentItem.image && currentItem.image.thumb && currentItem.url) {
                        str += ` <a href="detail.html?dag=${currentItem.day}&slug=${currentItem.slug}" class="events__link detail-js" data-type="${currentItem.id}" data-day="${currentItem.day}" href="#">
                                    <div class="bg" style="background-image: url(${currentItem.image.thumb})"> <span class="date date-js">${currentItem.start} u.</span></div>
                                    <div class="events__content">
                                        <h2>${currentItem.title}</h2>
                                        <div class="place">${currentItem.location}</div>
                                    </div>
                                </a>`;
                    }
    
                }
                eventsConteiner.innerHTML = str;
            }

        },
        dayTogleEvents() {
            const viewLikeImage = document.querySelector('.choice-img');
            const viewLikeList = document.querySelector('.choice-list');
            const listItem = document.querySelectorAll('.list-item');
            const imageItem = document.querySelectorAll('.image-item-js');
            const imageSvg = document.querySelector('.choice-img__svg');
            const listSvg = document.querySelector('.choice-list__svg');
            if(viewLikeImage || viewLikeList) {
                viewLikeImage.addEventListener('click', function(e) {
                    listItem.forEach((l) => {
                    l.style.display = 'none';
                    });    
                    imageItem.forEach((i) => {    
                        i.style.display = 'block';
                        imageSvg.style.fill = 'white';
                        viewLikeImage.style.backgroundColor = '#000';
                        viewLikeImage.style.border = '2px dotted rgb(255, 0, 0)';
                        viewLikeList.style.backgroundColor = '#fff';
                        listSvg.style.fill = 'black';
                        viewLikeList.style.border = '2px solid rgb(0, 0, 0)';
                    })     
                });
                viewLikeList.addEventListener('click', function(e) {
                    listItem.forEach((l) => {
                        l.style.display = 'block';
                        listSvg.style.fill = 'white';
                        viewLikeList.style.backgroundColor = '#000';
                        viewLikeList.style.border = '2px dotted rgb(255, 0, 0)';
                        viewLikeImage.style.border = '2px solid rgb(0, 0, 0)';
                        viewLikeImage.style.backgroundColor = '#fff';
                        imageSvg.style.fill = 'black';
                    });        
                    imageItem.forEach((i) => {
                        i.style.display = 'none';
                    })
                    // viewLikeImage.addEventListener('mouseover', function() {
                    //     viewLikeImage.style.backgroundColor = '#000';
                    //     imageSvg.style.fill = "white"; 
    
                    // });
                    // viewLikeImage.addEventListener('mouseout', function() {
                    //     viewLikeImage.style.backgroundColor = '#fff';
                    //     imageSvg.style.fill = "black"; 
    
                    // });
                });
             
            }
        }

        
        
    };
    app.initialize();
})();