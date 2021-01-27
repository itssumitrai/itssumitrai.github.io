var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};

// _snowpack/env.js
var env_exports = {};
__export(env_exports, {
  MODE: () => MODE,
  NODE_ENV: () => NODE_ENV,
  SSR: () => SSR
});
var MODE = "production";
var NODE_ENV = "production";
var SSR = false;

// _snowpack/pkg/svelte/internal.js
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.wholeText !== data)
    text2.data = data;
}
function set_style(node, key, value, important) {
  node.style.setProperty(key, value, important ? "important" : "");
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
var dirty_components = [];
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];
var resolved_promise = Promise.resolve();
var update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
var flushing = false;
var seen_callbacks = new Set();
function flush() {
  if (flushing)
    return;
  flushing = true;
  do {
    for (let i = 0; i < dirty_components.length; i += 1) {
      const component = dirty_components[i];
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  flushing = false;
  seen_callbacks.clear();
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
var outroing = new Set();
var outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  }
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor) {
  const {fragment, on_mount, on_destroy, after_update} = component.$$;
  fragment && fragment.m(target, anchor);
  add_render_callback(() => {
    const new_on_destroy = on_mount.map(run).filter(is_function);
    if (on_destroy) {
      on_destroy.push(...new_on_destroy);
    } else {
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment5, not_equal, props, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const prop_values = options.props || {};
  const $$ = component.$$ = {
    fragment: null,
    ctx: null,
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    before_update: [],
    after_update: [],
    context: new Map(parent_component ? parent_component.$$.context : []),
    callbacks: blank_object(),
    dirty,
    skip_bound: false
  };
  let ready = false;
  $$.ctx = instance2 ? instance2(component, prop_values, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment5 ? create_fragment5($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    flush();
  }
  set_current_component(parent_component);
}
var SvelteComponent = class {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
};

// dist/Nav.svelte.js
function create_fragment(ctx) {
  let nav;
  return {
    c() {
      nav = element("nav");
      nav.innerHTML = `<ul class="svelte-188s35v"><li class="svelte-188s35v"><a href="/" class="svelte-188s35v">Home</a></li></ul>`;
      attr(nav, "class", "nav svelte-188s35v");
    },
    m(target, anchor) {
      insert(target, nav, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(nav);
    }
  };
}
var Nav = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, create_fragment, safe_not_equal, {});
  }
};
var Nav_svelte_default = Nav;

// dist/Intro.svelte.js
function create_fragment2(ctx) {
  let section;
  return {
    c() {
      section = element("section");
      section.innerHTML = `<div class="left svelte-65k171"><img src="https://media-exp1.licdn.com/dms/image/C5603AQFPUL-g0sc2kw/profile-displayphoto-shrink_200_200/0/1546668568877?e=1617235200&amp;v=beta&amp;t=pX8oT6dOdN0PDdawaTJfqnuIycI2Z_F1j4c2ZsYXdyI" height="100" width="100" alt="Sumit Rai profile picture" class="svelte-65k171"/></div> 
    <div class="right svelte-65k171"><h1 class="svelte-65k171">Sumit Rai</h1> 
        <p class="svelte-65k171">Principal Dev Software Engineer <a href="https://www.verizonmedia.com/" class="company-link svelte-65k171">@Verizon Media</a></p> 
        <p class="svelte-65k171">Professional experience of 9+ yrs, passionate about web development &amp; technologies</p> 
        <footer class="svelte-65k171"><a href="https://github.com/itssumitrai" title="Github" class="svelte-65k171"><svg class="github svelte-65k171" role="img" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg></a> 
            <a href="https://www.linkedin.com/in/sumitrai1987/" title="Linked in" class="svelte-65k171"><svg class="linkedin svelte-65k171" role="img" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg></a> 
            <a href="mailto:sumit.rai1987@gmail.com" class="svelte-65k171"><svg class="email svelte-65k171" role="img" viewBox="0 0 512 512"><path d="M460.586 91.31H51.504c-10.738 0-19.46 8.72-19.46 19.477v40.088l224 104.03 224-104.03v-40.088c0-10.757-8.702-19.478-19.458-19.478M32.046 193.426V402.96c0 10.758 8.72 19.48 19.458 19.48h409.082c10.756 0 19.46-8.722 19.46-19.48V193.428l-224 102.327-224-102.327z" transform=""></path></svg></a></footer></div>`;
      attr(section, "class", "intro svelte-65k171");
    },
    m(target, anchor) {
      insert(target, section, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(section);
    }
  };
}
var Intro = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, create_fragment2, safe_not_equal, {});
  }
};
var Intro_svelte_default = Intro;

// dist/Card.svelte.js
function create_if_block_1(ctx) {
  let img;
  let img_src_value;
  return {
    c() {
      img = element("img");
      if (img.src !== (img_src_value = ctx[6]))
        attr(img, "src", img_src_value);
      attr(img, "alt", ctx[0]);
    },
    m(target, anchor) {
      insert(target, img, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 64 && img.src !== (img_src_value = ctx2[6])) {
        attr(img, "src", img_src_value);
      }
      if (dirty & 1) {
        attr(img, "alt", ctx2[0]);
      }
    },
    d(detaching) {
      if (detaching)
        detach(img);
    }
  };
}
function create_else_block(ctx) {
  let p;
  let t;
  return {
    c() {
      p = element("p");
      t = text(ctx[5]);
      attr(p, "class", "svelte-13b4bbp");
    },
    m(target, anchor) {
      insert(target, p, anchor);
      append(p, t);
    },
    p(ctx2, dirty) {
      if (dirty & 32)
        set_data(t, ctx2[5]);
    },
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
function create_if_block(ctx) {
  let p;
  return {
    c() {
      p = element("p");
      attr(p, "class", "svelte-13b4bbp");
    },
    m(target, anchor) {
      insert(target, p, anchor);
      p.innerHTML = ctx[2];
    },
    p(ctx2, dirty) {
      if (dirty & 4)
        p.innerHTML = ctx2[2];
      ;
    },
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
function create_fragment3(ctx) {
  let section;
  let t0;
  let div2;
  let h2;
  let t1;
  let t2;
  let div1;
  let a;
  let t3;
  let t4;
  let div0;
  let span0;
  let t5;
  let t6;
  let span1;
  let t7;
  let t8;
  let t9;
  let button;
  let t10_value = (ctx[8] ? "Back" : "Read more") + "";
  let t10;
  let section_class_value;
  let mounted;
  let dispose;
  let if_block0 = !ctx[8] && ctx[6] && create_if_block_1(ctx);
  function select_block_type(ctx2, dirty) {
    if (ctx2[8])
      return create_if_block;
    return create_else_block;
  }
  let current_block_type = select_block_type(ctx, -1);
  let if_block1 = current_block_type(ctx);
  return {
    c() {
      section = element("section");
      if (if_block0)
        if_block0.c();
      t0 = space();
      div2 = element("div");
      h2 = element("h2");
      t1 = text(ctx[0]);
      t2 = space();
      div1 = element("div");
      a = element("a");
      t3 = text(ctx[3]);
      t4 = space();
      div0 = element("div");
      span0 = element("span");
      t5 = text(ctx[7]);
      t6 = space();
      span1 = element("span");
      t7 = text(ctx[4]);
      t8 = space();
      if_block1.c();
      t9 = space();
      button = element("button");
      t10 = text(t10_value);
      attr(h2, "class", "svelte-13b4bbp");
      attr(a, "href", ctx[1]);
      attr(a, "class", "card-link svelte-13b4bbp");
      set_style(span0, "margin-right", "0.5rem");
      attr(span0, "class", "location svelte-13b4bbp");
      attr(span1, "class", "period svelte-13b4bbp");
      attr(div1, "class", "header svelte-13b4bbp");
      attr(button, "class", "actionBtn svelte-13b4bbp");
      attr(div2, "class", "svelte-13b4bbp");
      attr(section, "class", section_class_value = "card " + (ctx[8] ? "expanded" : "") + " svelte-13b4bbp");
    },
    m(target, anchor) {
      insert(target, section, anchor);
      if (if_block0)
        if_block0.m(section, null);
      append(section, t0);
      append(section, div2);
      append(div2, h2);
      append(h2, t1);
      append(div2, t2);
      append(div2, div1);
      append(div1, a);
      append(a, t3);
      append(div1, t4);
      append(div1, div0);
      append(div0, span0);
      append(span0, t5);
      append(div0, t6);
      append(div0, span1);
      append(span1, t7);
      append(div2, t8);
      if_block1.m(div2, null);
      append(div2, t9);
      append(div2, button);
      append(button, t10);
      if (!mounted) {
        dispose = listen(button, "click", ctx[9]);
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (!ctx2[8] && ctx2[6]) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_1(ctx2);
          if_block0.c();
          if_block0.m(section, t0);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (dirty & 1)
        set_data(t1, ctx2[0]);
      if (dirty & 8)
        set_data(t3, ctx2[3]);
      if (dirty & 2) {
        attr(a, "href", ctx2[1]);
      }
      if (dirty & 128)
        set_data(t5, ctx2[7]);
      if (dirty & 16)
        set_data(t7, ctx2[4]);
      if (current_block_type === (current_block_type = select_block_type(ctx2, dirty)) && if_block1) {
        if_block1.p(ctx2, dirty);
      } else {
        if_block1.d(1);
        if_block1 = current_block_type(ctx2);
        if (if_block1) {
          if_block1.c();
          if_block1.m(div2, t9);
        }
      }
      if (dirty & 256 && t10_value !== (t10_value = (ctx2[8] ? "Back" : "Read more") + ""))
        set_data(t10, t10_value);
      if (dirty & 256 && section_class_value !== (section_class_value = "card " + (ctx2[8] ? "expanded" : "") + " svelte-13b4bbp")) {
        attr(section, "class", section_class_value);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(section);
      if (if_block0)
        if_block0.d();
      if_block1.d();
      mounted = false;
      dispose();
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let {title = "Card"} = $$props;
  let {link = ""} = $$props;
  let {content = ""} = $$props;
  let {org = ""} = $$props;
  let {period = ""} = $$props;
  let {snippet = ""} = $$props;
  let {image = ""} = $$props;
  let {location = ""} = $$props;
  let expanded = false;
  function handleClick() {
    $$invalidate(8, expanded = !expanded);
  }
  $$self.$$set = ($$props2) => {
    if ("title" in $$props2)
      $$invalidate(0, title = $$props2.title);
    if ("link" in $$props2)
      $$invalidate(1, link = $$props2.link);
    if ("content" in $$props2)
      $$invalidate(2, content = $$props2.content);
    if ("org" in $$props2)
      $$invalidate(3, org = $$props2.org);
    if ("period" in $$props2)
      $$invalidate(4, period = $$props2.period);
    if ("snippet" in $$props2)
      $$invalidate(5, snippet = $$props2.snippet);
    if ("image" in $$props2)
      $$invalidate(6, image = $$props2.image);
    if ("location" in $$props2)
      $$invalidate(7, location = $$props2.location);
  };
  return [
    title,
    link,
    content,
    org,
    period,
    snippet,
    image,
    location,
    expanded,
    handleClick
  ];
}
var Card = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment3, safe_not_equal, {
      title: 0,
      link: 1,
      content: 2,
      org: 3,
      period: 4,
      snippet: 5,
      image: 6,
      location: 7
    });
  }
};
var Card_svelte_default = Card;

// dist/cards.js
var cards_default = [
  {
    title: "Principal Software Dev Engineer",
    link: "https://www.verizonmedia.com/",
    organization: "Verizon Media Inc.",
    location: "Sunnyvale, CA",
    period: "2012 - Current",
    snippet: "Technical FE Lead on Yahoo Finance, Yahoo Money, Yahoo News and Cashay with hands-on coding & FE architecture",
    content: `<ul>
        <li>Technical FE Lead on Yahoo Finance, Yahoo News, Entertainment, some other handful sites which includes core functionality, application logic, operational reliability, and scalability/performance.</li>
        <li>Lead projects in web development, involving pure development, solving complex FE engineering problems, consistently look for improvements in code reusability, optimizations, performance, etc for Yahoo Finance and others.</li>
        <li>Define technical architectures, guide development teams on implementation, and do hands-on coding</li>
        <li>Mentor and guide engineers to grow technical talent in the team</li>
        <li>Promote technical excellence practices, including effective design reviews, agile methodologies, code quality, code reviews, etc.</li>
    </ul>`
  },
  {
    title: "Sr Software Dev Engineer",
    link: "https://www.verizonmedia.com/",
    organization: "Verizon Media Inc.",
    location: "Sunnyvale, CA",
    period: "Mar 2018 - Oct 2019",
    snippet: "Lead web development engineering and collaborate with designers, product and backend teams to help define, build and deliver  core and critical features for Yahoo Finance web",
    content: `<ul>
            <li>Lead web development engineering and collaborate with designers, product and backend teams to help define, build and deliver  core and critical features for Yahoo Finance web</li>
            <li>Lead implementation and development efforts along with app architecture/design reviews, code reviews, testing and performance tuning with hands-on coding.</li>
            <li>Own and deliver large complex web projects and help shape technical direction, product designs and team processes for Yahoo Finance</li>
            <li>Skills: React, JS, Node</li>
        </ul>`
  },
  {
    title: "Tech Yahoo, Software Dev Engineer",
    link: "https://yahoo.com/",
    organization: "Yahoo Inc.",
    location: "Sunnyvale, CA",
    period: "Mar 2016 - Mar 2018",
    snippet: "FE Lead on Yahoo Finance web, and implement core features",
    content: `<ul>
            <li>Contribute heavily to Yahoo Finance web through implementation of core features and collaboration with product, design and backend systems.</li>
            <li>Implementation of core web features, but not limited to: Tradeit Integration for stock trading, Screeners, Calendar, performance improvements, etc. for all devices.</li>
            <li>Focus on Agile methodologies, code quality, code testing via automation, code reviews to ensure good team process and timely deliverables</li>
            <li>Skills: React, JS, Node</li>
        </ul>`
  },
  {
    title: "Tech Yahoo, Software Dev Eng, Intermediate",
    link: "https://yahoo.com/",
    organization: "Yahoo Inc.",
    location: "Sunnyvale, CA",
    period: "Jan 2015 - Mar 2016",
    snippet: "Yahoo Finance FE web development",
    content: `<ul>
            <li>Yahoo Finance migration to modern tech stack using React to improve our user engagement, development cycles and revenue.</li>
            <li>Implemented new UI features and tools required on the new Yahoo Finance web.</li>
            <li>Skills: React, JS, Node</li>
        </ul>`
  },
  {
    title: "Sr Software Engineer",
    link: "https://yahoo.com/",
    organization: "Yahoo Software Development Pvt. Ltd.",
    location: "Bangalore, India",
    period: "Apr 2013 - Jan 2015",
    snippet: "FE at Yahoo Finance, Yahoo Autos and Yahoo Travel. Backend with Hadoop at Yahoo Shopping.",
    content: `<ul>
            <li>Yahoo Finance web maintenance and bug fixes to ensure smooth user experience</li>
            <li>UI Refresh for Yahoo Autos by developing new features on the web and moving to a new and modern stack.</li>
            <li>Yahoo Travel web legacy maintenance and migration to a modern tech stack by implementing new features</li>
            <li>Implemented a Grid processing pipeline to provide data for the API Layer to consume along with automated Oozie workflows for Yahoo Shopping</li>
            <li>Skills: PHP, JS, YUI, legacy Yahoo systems, Java, Pig, Hadoop, Oozie</li>
        </ul>`
  }
];

// dist/App.svelte.js
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[0] = list[i];
  return child_ctx;
}
function create_each_block(ctx) {
  let card;
  let current;
  card = new Card_svelte_default({
    props: {
      title: ctx[0].title,
      link: ctx[0].link,
      org: ctx[0].organization,
      period: ctx[0].period,
      snippet: ctx[0].snippet,
      content: ctx[0].content,
      location: ctx[0].location
    }
  });
  return {
    c() {
      create_component(card.$$.fragment);
    },
    m(target, anchor) {
      mount_component(card, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(card.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(card.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(card, detaching);
    }
  };
}
function create_fragment4(ctx) {
  let main;
  let header;
  let nav;
  let t0;
  let intro;
  let t1;
  let article;
  let t2;
  let footer;
  let current;
  nav = new Nav_svelte_default({});
  intro = new Intro_svelte_default({});
  let each_value = cards_default;
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      main = element("main");
      header = element("header");
      create_component(nav.$$.fragment);
      t0 = space();
      create_component(intro.$$.fragment);
      t1 = space();
      article = element("article");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t2 = space();
      footer = element("footer");
      footer.textContent = "Sumit Rai 2021";
      attr(header, "class", "app-header svelte-1i8q6uy");
      attr(article, "class", "card-container svelte-1i8q6uy");
      attr(footer, "class", "svelte-1i8q6uy");
      attr(main, "class", "app svelte-1i8q6uy");
    },
    m(target, anchor) {
      insert(target, main, anchor);
      append(main, header);
      mount_component(nav, header, null);
      append(header, t0);
      mount_component(intro, header, null);
      append(main, t1);
      append(main, article);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(article, null);
      }
      append(main, t2);
      append(main, footer);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (dirty & 0) {
        each_value = cards_default;
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(article, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(nav.$$.fragment, local);
      transition_in(intro.$$.fragment, local);
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      transition_out(nav.$$.fragment, local);
      transition_out(intro.$$.fragment, local);
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(main);
      destroy_component(nav);
      destroy_component(intro);
      destroy_each(each_blocks, detaching);
    }
  };
}
var App = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, create_fragment4, safe_not_equal, {});
  }
};
var App_svelte_default = App;

// dist/index.js
import.meta.env = env_exports;
var app = new App_svelte_default({
  target: document.body
});
var dist_default = app;
if (void 0) {
  (void 0).accept();
  (void 0).dispose(() => {
    app.$destroy();
  });
}
export {
  dist_default as default
};
