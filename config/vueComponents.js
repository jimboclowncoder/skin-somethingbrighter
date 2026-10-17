/* Estructura del foro */
Vue.component('cabecera-foro', {
    data() {
        return {
            title: this.$slots['title'][0].tag === undefined ? Vue.filter('mini-sanitize')(this.$slots['title'][0].text) : Vue.filter('mini-sanitize')(this.$slots['title'][0].children[0].text)
        }
    },
    template: `
    <div class="forum-head regular-head">
        <h3 v-html="title"></h3>
    </div>
    `
});

Vue.component('cabcategoria-foro', {
    data() {
        return {
            title: this.$slots['title'][0].tag === undefined ? Vue.filter('mini-sanitize')(this.$slots['title'][0].text) : Vue.filter('mini-sanitize')(this.$slots['title'][0].children[0].text)
        }
    },
    template: `
    <div class="forum-head category-head">
        <h3 v-html="title"></h3>
    </div>
    `
});

Vue.component('cabespecial-foro', {
    data() {
        return {
            title: this.$slots['title'][0].tag === undefined ? Vue.filter('mini-sanitize')(this.$slots['title'][0].text) : Vue.filter('mini-sanitize')(this.$slots['title'][0].children[0].text)
        }
    },
    template: `
    <div class="forum-head special-head">
        <h3 v-html="title"></h3>
        <nav id="forum-breadcrumb" class="breadcrumb has-succeeds-separator left" aria-label="breadcrumbs">
        	<ul></ul>
    	</nav>
    </div>
    `
});

Vue.component('controles-foro', {
    data() {
        return {
            forumName: forumData.name,
            maPage: 0,
            userName: _userdata.username,
            userLevel: _userdata.user_level,
            userId: _userdata.user_id,
            userLog: _userdata.session_logged_in,
            userMP: 0,
            userOut: '',
            isActive: false
        };
    },
    computed: {
        isActiveClass() {
            return 'has-bg' + ((this.isActive) ? ' visible' : ' not-visible');
        }
    },
    methods: {
        turnActive() {
            this.isActive = (this.isActive) ? false : true;
        }
    },
    created() {
        if (this.userLog !== 0) {
            if (document.querySelector('#i_icon_mini_new_message') !== null && document.querySelector('#i_icon_mini_new_message').title.match(/[0-255]/) !== null) {
                this.userMP = parseInt(document.querySelector('#i_icon_mini_new_message').title.match(/[0-255]/)[0]);
            }

            this.userOut = document.querySelector('#logout').href;
        }
    },
    template: `
    <div class="main-body">
        <div class="left">
            <a href="/" :title="'Ir al índice de «' + forumName + '»'">{{ forumName }}</a>
        </div>
        <nav class="right">   
            <section id="forum-navbar-desktop" class="is-hidden-touch">
                <navbar-foro :username="userName" :userlevel="userLevel" :userid="userId" :userlog="userLog" :usermp="userMP" :userout="userOut" />
            </section>
            <section id="forum-navbar-mobile" class="is-hidden-desktop">
                <div id="hmg-button" @click="turnActive()" class="is-pointer">
                    <i class="fas fa-bars"></i>
                </div>
                <div id="hmg-menu" :class="isActiveClass">
                    <h3>{{ userName | just-name }}<i class="fas fa-times is-pointer" @click="turnActive()"></i></h3>
                    <navbar-foro :username="userName" :userlevel="userLevel" :userid="userId" :userlog="userLog" :usermp="userMP" :userout="userOut" />
                </div>
                <div class="bg-active" @click="turnActive()"></div>
            </section>
            <section v-if="maPage === 1" id="multiaccount-transition">
                <cargando-foro text="Cambiando de cuenta…"></cargando-foro>
            </section>
        </nav>
    </div>
    `
});

Vue.component('header-foro', {
    props: ['sitename'],
    data() {
        return {
            name: forumData.name,
            image: forumDefaults.logo
        }
    },
    template: `
    <section id="page-header" class="main-body">
        <a href="/" :title="'Ir al índice de «' + sitename + '»'" id="forum-logo">
            <template v-if="image">
                <img :src="image" :alt="name" />
            </template>
            <template v-else>
                <slot name="logo"></slot>
            </template>
        </a>
    </section>
    `
});

Vue.component('foro-foro', {
    props: ['url', 'name', 'posts', 'topics', 'lasturl'],
    data() {
        return {
            lastname: this.$slots['last-name'] === undefined ? '' : this.$slots['last-name'][0].text
        }
    },
    mounted() {
        const isForum = this.url.match(/f(\d+)-/) !== null;
        const prefix = isForum ? 'forum' : 'category';
        const classList = this.$el.parentElement.classList;
        const forumName = FNR.utility.genSlug(this.name, '-');
        const forumId = isForum ? this.url.match(/f(\d+)-/)[1] : this.url.match(/c(\d+)-/)[1];

        classList.add(`${prefix}-element`);
        classList.add(`${prefix}-${forumId}`);
        classList.add(`${prefix}-${forumName}`);
    },
    template: `
    <section class="forum-forum">
        <div class="forum-header">
            <a class="forum-title is-tweakeable" :href="url" :title="'Ir al subforo «' + name + '»'">
                <span class="is-measurable">{{ name }}</span>
            </a>
            <div class="forum-stats">{{ posts }} mensajes <span>—</span> {{ topics }} temas</div>
        </div>
        <div class="forum-content">
            <slot name="desc"></slot>
            <div class="forum-last">
                <template v-if="lasturl.length">
                    <div class="lastpost-content">
                        <a :href="lasturl" :title="'Último mensaje en el tema «' + lastname + '» por '" class="lastpost-link">{{ lastname }}</a><br /><slot name="last-date"></slot><br /><slot name="last-who"></slot>
                    </div>
                </template>
                <template v-else>Este subforo no tiene mensajes</template>
            </div>
        </div>
    </section>
    `
});

Vue.component('temas-foro', {
    props: ['type', 'url', 'replies', 'views', 'quick', 'lastpost', 'mode'],
    data() {
        return {
            title: this.$slots['title'][0].tag === undefined ? this.$slots['title'][0].text : this.$slots['title'][0].children[0].text
        }
    },
    computed: {
        currentMode() {
            const mode = typeof forumConfig.skinOptions.showTopicType === 'undefined' ? false : forumConfig.skinOptions.showTopicType;

            if (this.mode.indexOf('<strong>') > -1 && mode) {
                return this.mode.split('<strong>')[1].split(':</strong>')[0];
            } else {
                return '';
            }
        },
        currentType() {
            let type = this.type;

            if (window.location.pathname.indexOf('/merge') > -1) {
                type = 'radio';
            } else if (window.location.pathname.indexOf('/modcp') > -1) {
                type = 'checkbox';
            }

            return type;
        },
        currentClass() {
            const translate = {
                mp: 'mp',
                draft: 'draft',
                radio: 'mp',
                checkbox: 'mp',
                followed: 'mp'
            };

            return 'topiclist-topic' + (this.currentType !== 'normal' ? ' topic-' + translate[this.currentType] : '');
        }
    },
    mounted() {
        const list = ['checkbox', 'radio'];

        const classList = this.$el.parentElement.classList;

        if (this.currentType !== 'normal') {
            classList.add('is-not-lastpost');
        }

        if (list.indexOf(this.currentType) > -1) {
            classList.add('is-mod');
        }

        if (this.$el.querySelectorAll('.topic-repliesandviews span')) {
            const keyWords = ['respuestas', 'visitas'];

            this.$el.querySelectorAll('.topic-repliesandviews span').forEach(item => {
                if (keyWords.some(keyword => item.textContent.includes(keyword))) {
                    const content = item.textContent.trim().split(' ');

                    item.innerHTML = `<em>${content[0]}</em> ${content[1]}`;
                }
            });
        }
    },
    template: `
    <div :class="currentClass">
        <template v-if="currentType === 'draft'">
            <div class="topic-main">
                <div class="topic-icon"></div>
                <div class="topic-container">
                    <span class="topic-title">
                        <a :href="url" :title="'Ir al tema «' + title + '»'">{{ title }}</a>
                    </span>
                    <div class="topic-author">{{ lastpost }}</div>
                </div>
            </div>
            <div class="topic-repliesandviews">
                {{ replies }} — {{ views }}
            </div>
            <div class="topic-quicklink">
                <a class="topic-lastpost" :href="quick" :title="'Ir al bosquejo «' + title + '»'">
                    <i class="fas fa-pencil-alt"></i>
                </a>
            </div>
        </template>
        <template v-else-if="currentType === 'followed'">
            <div class="topic-main">
                <div class="topic-icon"></div>
                <div class="topic-container">
                    <span class="topic-title">
                        <a :href="url" :title="'Ir al tema «' + title + '»'">{{ title }}</a>
                    </span>
                </div>
            </div>
            <div class="topic-repliesandviews">
                {{ replies }} — {{ views }}
            </div>
            <div class="topic-quicklink">
                <div class="topic-lastpost" title="¡Seleccióname!">
                    <slot name="radio"></slot>
                </div>
            </div>
        </template>
        <template v-else-if="currentType === 'mp'">
            <div class="topic-main">
                <div class="topic-icon"></div>
                <div class="topic-container">
                    <span class="topic-title">
                        <a :href="url" :title="'Ir al mensaje privado «' + title + '»'">{{ title }}</a>
                    </span>
                    <div class="topic-extra">
                        <div class="topic-author">Por <slot name="who"></slot></div>
                    </div>
                </div>
            </div>
            <div class="topic-repliesandviews">
                {{ views }}
            </div>
            <div class="topic-quicklink">
                <div class="topic-lastpost" title="¡Seleccióname!">
                    <div class="forum-checkbox">
                        <div class="checkbox-content">
                            <div class="checkbox-click">
                                <i class="fas fa-check"></i>
                            </div>
                        </div>
                        <div class="checkbox-real"><slot name="checkbox"></slot></div>
                    </div>
                </div>
            </div>
            <div class="to-process">
                <slot name="status"></slot>
            </div>
        </template>
        <template v-else-if="currentType === 'radio'">
            <div class="topic-main">
                <div class="topic-icon"></div>
                <div class="topic-container">
                    <span class="topic-title">
                        <a :href="url" :title="'Ir al tema «' + title + '»'">{{ title }}</a>
                    </span>
                    <div class="topic-extra">
                        <div class="topic-author">Por <slot name="topic-author"></slot></div>
                    </div>
                </div>
            </div>
            <div class="topic-repliesandviews">
                {{ replies }}
            </div>
            <div class="topic-quicklink">
                <div class="topic-lastpost" title="¡Seleccióname!">
                    <div class="forum-checkbox">
                        <div class="checkbox-content">
                            <div class="checkbox-click">
                                <i class="fas fa-check"></i>
                            </div>
                        </div>
                        <div class="checkbox-real"><slot name="checkbox"></slot></div>
                    </div>
                </div>
            </div>
            <div class="to-process">
                <slot name="status"></slot>
            </div>
        </template>
        <template v-else-if="currentType === 'checkbox'">
            <div class="topic-main">
                <div class="topic-icon"></div>
                <div class="topic-container">
                    <span class="topic-title">
                        <a :href="url" :title="'Separar tema «' + title + '»'">{{ title }}</a>
                    </span>
                    <div class="topic-extra">
                        <div class="topic-author">{{ lastpost }}</div>
                    </div>
                </div>
            </div>
            <div class="topic-repliesandviews">
                {{ replies }}
            </div>
            <div class="topic-quicklink">
                <div class="topic-lastpost" title="¡Seleccióname!">
                    <div class="forum-checkbox">
                        <div class="checkbox-content">
                            <div class="checkbox-click">
                                <i class="fas fa-check"></i>
                            </div>
                        </div>
                        <div class="checkbox-real"><slot name="checkbox"></slot></div>
                    </div>
                </div>
            </div>
            <div class="to-process">
                <slot name="status"></slot>
            </div>
        </template>
        <template v-else>
            <div class="topic-main">
                <div class="topic-icon"></div>
                <div class="topic-container">
                    <span class="topic-title">
                        <a :href="url" :title="'Ir al tema «' + title + '»'"><template v-if="currentMode.length">{{ currentMode }}: </template>{{ title }}</a>
                    </span>
                    <div class="topic-extra">
                        <div class="topic-pagination to-process">Páginas: <slot name="pagination"></slot></div>
                        <div class="topic-extra-separador">-</div>
                        <div class="topic-author">Por <slot name="topic-author"></slot></div>
                    </div>
                </div>
            </div>
            <div class="topic-repliesandviews">
                {{ replies }} — {{ views }}
            </div>
            <div class="topic-quicklink">
                <div class="topic-last">
                    <a class="topic-lastpost">
                        <i class="fas fa-link"></i> Último mensaje
                    </a> por <span class="topic-lastauthor"></span>, <br /><span class="topic-lastdate"></span>
                </div>
            </div>
            <div class="to-process">
                <slot name="status"></slot>
                <slot name="last-post"></slot>
            </div>
        </template>
      </div>
      `
});

Vue.component('mensaje-foro', {
    props: ['id', 'online', 'edited', 'date'],
    computed: {
        slugId() {
            return 'post-' + this.id;
        },
        currentClass() {
            return 'postlist-post' + this.online;
        },
        currentDate() {
            const getDate = (txt) => {
                return txt.split('el ')[1];
            };

            if (this.date.length) return (this.date.indexOf('el') > -1 ? getDate(this.date).trim() : this.date.trim()) + ((this.edited.length && this.edited.indexOf('not-show') === -1) ? ' <a title="' + (this.edited.split('<br /><br />')[1].split(',')[0]) + '">Editado</a> ' : '');
            else return '';
        }
    },
    template: `
    <section :id="slugId" :class="currentClass">
        <a :id="id" class="page-anchor" />
        <div class="post-main">
            <div class="post-profile">
                <slot name="profile"></slot>
            </div>
            <div class="post-content">
                <div class="post-info">
                    <div class="post-side">
                        <a :href="'#' + id" title="Enlace permanente" class="post-permalink">
                            <i class="fas fa-link"></i>
                        </a>
                        <div class="post-title" v-html="currentDate" v-if="currentDate.length"></div>
                    </div>
                    <ul class="post-buttons"></ul>
                </div>
                <div class="is-content">
                    <slot name="content"></slot>
                </div>
            </div>
        </div>
        <div class="post-signature">
            <div class="signature-side"></div>
        </div>
    </section>
    `
});

Vue.component('memberitem-foro', {
    props: ['profile', 'type'],
    data() {
        return {
            configType: this.profile === 'none' ? false : true,
            configName: forumConfig.profileOptions.profileName || 'perfil',
            configRank: forumConfig.profileOptions.profileRank,
            url: '/',
            title: `Ir al índice de «${forumData.name}»`,
            mp: '/',
            name: 'Usuario',
            avatar: forumDefaults.avatar,
            alt: 'Avatar por defecto',
            rank: 'Miembro',
            group: 'usergroup-unknown',
            messages: 0,
            lastvisit: 'Cargando…',
            currentlyLooking: ''
        }
    },
    created() {
        if (this.$slots['name']) {
            if (this.$slots['name'][0].text) {
                this.name = this.$slots['name'][0].text;
            } else {
                this.name = this.$slots['name'][0].children[0].children[0].text || 'Buscador';
            }
        }

        if (this.$slots['avatar']) {
            this.avatar = this.$slots['avatar'][0].data.attrs.src;
        }

        if (this.$slots['posts']) {
            this.messages = this.$slots['posts'][0].text;
        }

        if (this.$slots['last']) {
            this.lastvisit = this.$slots['last'][0].text;
        }

        if (this.$slots['site']) {
            this.currentlyLooking = this.$slots['site'][0].children[0].text;
        }

        if (this.configType) {
            FNR.user.getProfile(this.profile.split('/u')[1], .25).then((data) => {
                this.url = data.links.profile;
                this.title = `Ir al ${this.configName} de «${data.name}»`;
                this.mp = data.links.mp;
                this.alt = `Avatar de «${data.name}»`;
                this.rank = data.fields[this.configRank].content;
                this.group = 'usergroup-' + data.colour;

                if (!this.$slots['name']) {
                    this.name = data.name;
                }

                if (!this.$slots['avatar']) {
                    this.avatar = data.avatar;
                }

                if (!this.$slots['posts']) {
                    this.messages = data.messages.public;
                }

                if (!this.$slots['last']) {
                    this.lastvisit = data.lastvisit;
                }
            });
        }
    },
    template: `
    <a :class="'memberitem-element ' + group" :href="url" :title="title">
        <div class="memberlist-name">
            <h3 class="is-tweakeable">
                <span class="is-measurable">{{ name }}</span>
            </h3>
        </div>
        <div v-if="type === 'memberlist'" class="memberlist-extra">{{ currentlyLooking ? currentlyLooking : lastvisit }}</div>
        <div class="memberlist-avatar">
            <img :src="avatar" :alt="alt" />
        </div>
    </a>
    `
});

Vue.component('estadisticas-foro', {
    props: ['msg', 'users'],
    data() {
        return {
            lastTopics: [],
            userLog: _userdata.session_logged_in
        }
    },
    created() {
        FNR.forum.getTopics(forumConfig.skinOptions.excludedForums, forumConfig.skinOptions.lastTopics).then((r) => {
            this.lastTopics = r;
        });
    },
    template: `
    <ul class="columns is-multiline is-vcentered is-gapless">
        <li id="bloque-actuales" class="column is-half is-full-mobile">
            <div id="new-connected">
                <h6>Ahora</h6>
                <div class="has-users">
                    <span class="curconnected-users"></span>
                </div>
            </div>
        </li>
        <li id="bloque-historico" class="column is-half is-full-mobile">
            <div id="past-connected">
                <h6>Últimas <span class="lastconnected-hour"></span> horas</h6>
                <div class="has-users">
                    <span class="lastconnected-users"></span>
                </div>
            </div>
            <div id="current-groups">
                <h6>Grupos</h6>
                <ul id="census"></ul>
            </div>
        </li>
        <li id="bloque-ultimostemas" class="column is-full">
            <h6>Últimos temas</h6>
            <ul class="ltopic-list">
                <li v-for="topic in lastTopics">
                    <tema-ref :info="topic"></tema-ref>
                </li>
            </ul>
            <small>También tienes la lista <a href="/latest" title="Ir a la página de «Últimos temas»">general</a><template v-if="userLog !== 0"> o desde tu <a href="/search?search_id=newposts" title="Ir a la página de «Desde última conexión»">ultima conexión</a></template>.</small>
        </li>
    </ul>
    `
});

Vue.component('footer-foro', {
    data() {
        return {
            afis: {},
            normal: forumConfig.usableDirections.normal,
            credits: forumCredits.paragraphs,
            social: forumCredits.social
        }
    },
    created() {
        FNR.forum.getAffiliates().then((data) => {
            this.afis = data;
        });
    },
    template: `
    <section id="page-afiliates" class="main-body">
        <categoria-foro id="afiliados">
            <cabcategoria-foro><template slot="title">Afiliados</template></cabcategoria-foro>
            <ul class="columns is-vcentered">
                <li id="forum-affiliates" class="column is-full">
                    <ul class="columns is-multiline">
                        <li id="forum-affiliates-elite" class="column">
                            <ul class="columns is-multiline">
                                <li class="column is-full affiliates-collection">
                                    <h3 class="section-title">Élite</h3>
                                    <ul v-html="afis.elite" class="no-style"></ul>
                                </li>
                                <li class="column is-full affiliates-collection">
                                    <h3 class="section-title">Directorios</h3>
                                    <ul v-html="afis.directory" class="no-style"></ul>
                                </li>
                            </ul>
                        </li>
                        <li id="forum-affiliates-sisters" class="column">
                            <h3 class="section-title">Hermanas</h3>
                            <ul v-html="afis.sister" class="no-style"></ul>
                        </li>
                        <li id="forum-affiliates-regular" class="column is-full" v-if="normal.length">
                            <h3 class="section-title"><a :href="normal" title="Ir a «Afiliaciones Normales»"><i class="fas fa-link"></i> Normales</a></h3>
                        </li>
                    </ul>
                </li>
            </ul>
        </categoria-foro>
        <categoria-foro id="creditos">
            <cabcategoria-foro><template slot="title">Créditos</template></cabcategoria-foro>
            <ul class="columns is-vcentered">
                <li id="forum-cred" class="column is-full">
                    <div class="msg-element is-content">
                        <ul class="no-style">
                            <li v-for="credit in credits" v-html="credit"></li>
                            <li class="is-hidden-mobile">El diseño y programación de la skin <a target="_blank" href="https://sthbrighter-skin.foroactivo.com/" title="Ir al sitio web de «Something Brighter»">Something Brighter</a> por <a target="_blank" href="https://jimboclowncoder.tumblr.com/" title="Ir al sitio web de «@jimboclowncoder»">@jimboclowncoder</a>. Agradecimiento especial a los equipos desarrolladores de <a target="_blank" href="https://vuejs.org/" title="Ir al sitio web de «Vue»">Vue</a> y <a target="_blank" href="https://bulma.io/" title="Ir al sitio web de «Bulma»">Bulma</a> por sus respectivos <em>Frameworks</em>.</li>
                            <li id="credits-social" v-if="social.length">
                                <ul class="no-style">
                                    <li v-for="platform in social">
                                        <a target="_blank" :href="platform.url" :title="'Ir a «' + platform.name + '»'"><em :class="platform.icon"></em> {{ platform.name }}</a>
                                    </li>
                                </ul>
                            </li>                                                                                          
                        </ul>
                    </div>
                </li>
            </ul>
        </categoria-foro>
    </section>
    `
});

/* Topbar */
Vue.component('tablon-titulo', {
    props: ['title'],
    template: `
    <h4 class="plank-title" v-html="title"></h4>
    `
});

Vue.component('tablon-superior', {
    data() {
        return {
            name: forumData.name,
        }
    },
    template: `
    <ul id="side-section">
        <li id="plank-help" class="plank-block">
            <tablon-titulo title="Ayuda"></tablon-titulo>
            <links-ayuda></links-ayuda>
        </li>
        <li id="plank-anmt" class="plank-block">
            <tablon-titulo title="Anuncios"></tablon-titulo>
            <links-anuncios></links-anuncios>
        </li>
        <li id="plank-staff" class="plank-block">
            <tablon-titulo title="Administración"></tablon-titulo>
            <links-staff></links-staff>
        </li>
        <li id="plank-search" class="plank-block">
            <tablon-titulo title="Búsquedas"></tablon-titulo>
            <busquedas></busquedas>
        </li>
        <li id="plank-sq" class="plank-block">
            <tablon-titulo title="¿Sabías qué?"></tablon-titulo>
            <sabias-que></sabias-que>
        </li>
    </ul>
    `
});

Vue.component('links-ayuda', {
    data() {
        return {
            links: forumContent.links
        }
    },
    template: `
    <div id="help-main">
        <a :href="link.url" :title="'Ir a «' + link.name + '»'" v-for="link in links">{{ link.name }}</a>
    </div>
    `
});

Vue.component('links-anuncios', {
    data() {
        return {
            announcements: forumContent.announcements.list
        }
    },
    template: `
    <ul>
        <li v-for="announcement in announcements">
            <a :href="announcement.url" :title="'Ir al anuncio «' + announcement.name + '»'" class="anmt-element">
                <span class="anmt-date">{{ announcement.date }}</span>
                <span class="anmt-title">{{ announcement.name }}</span>
            </a>
        </li>
    </ul>
    `
});

Vue.component('links-staff', {
    data() {
        return {
            staff: forumContent.staff
        }
    },
    template: `
    <ul>
        <li v-for="admin in staff">
            <a :href="admin.url" class="admin-element" :style="'background-image: url(' + admin.avatar + ')'" :title="admin.title">
                <span class="admin-name">{{ admin.name }}</span><span class="admin-desc">{{ admin.desc }}</span>
            </a>
        </li>
    </ul>
    `
});

Vue.component('sabias-que', {
    data() {
        return {
            content: forumContent.sq[Math.floor(Math.random() * forumContent.sq.length)]
        }
    },
    created() {
        setInterval(() => {
            this.content = forumContent.sq[Math.floor(Math.random() * forumContent.sq.length)];
        }, 12000);
    },
    template: `
    <div id="sq-img" class="topbar-element" :style="'background-image: url(' + content + ')'"></div>
    `
});

Vue.component('busquedas', {
    data() {
        return {
            content: forumContent.searches[Math.floor(Math.random() * forumContent.searches.length)]
        }
    },
    created() {
        setInterval(() => {
            this.content = forumContent.searches[Math.floor(Math.random() * forumContent.searches.length)];
        }, 16000);
    },
    template: `
    <a id="search-img" class="topbar-element" :style="'background-image: url(' + content.img + ')'" :href="content.url" :title="content.desc"></a>
    `
});