import React from 'react';
//import './ImageSlider.scss'
import './ImageSider.css'
import { gsap } from 'gsap';
import { svg } from "react-svg"

const { gsap, imagesLoaded } = window;

const buttons = {
	prev: document.getElementsByClassName("btn--left")[0],
	next: document.getElementsByClassName("btn--right")[0],
};
const cardsContainerEl = document.getElementsByClassName("cards__wrapper");
const appBgContainerEl = document.getElementsByClassName("app__bg");

const cardInfosContainerEl = document.getElementsByClassName("info__wrapper");

if (buttons.next) {
  buttons.next.addEventListener("click", () => swapCards("right"));
}

if (buttons.prev) {
  buttons.prev.addEventListener("click", () => swapCards("left"));
}

function swapCards(direction) {
	const currentCardEl = cardsContainerEl.getElementsByClassName("current--card");
	const previousCardEl = cardsContainerEl.getElementsByClassName("previous--card");
	const nextCardEl = cardsContainerEl.getElementsByClassName("next--card");

	const currentBgImageEl = appBgContainerEl.getElementsByClassName("current--image");
	const previousBgImageEl = appBgContainerEl.getElementsByClassName("previous--image");
	const nextBgImageEl = appBgContainerEl.getElementsByClassName("next--image");

	changeInfo(direction);
	swapCardsClass();

	removeCardEvents(currentCardEl);

	function swapCardsClass() {
		currentCardEl.classList.remove("current--card");
		previousCardEl.classList.remove("previous--card");
		nextCardEl.classList.remove("next--card");

		currentBgImageEl.classList.remove("current--image");
		previousBgImageEl.classList.remove("previous--image");
		nextBgImageEl.classList.remove("next--image");

		currentCardEl.style.zIndex = "50";
		currentBgImageEl.style.zIndex = "-2";

		if (direction === "right") {
			previousCardEl.style.zIndex = "20";
			nextCardEl.style.zIndex = "30";

			nextBgImageEl.style.zIndex = "-1";

			currentCardEl.classList.add("previous--card");
			previousCardEl.classList.add("next--card");
			nextCardEl.classList.add("current--card");

			currentBgImageEl.classList.add("previous--image");
			previousBgImageEl.classList.add("next--image");
			nextBgImageEl.classList.add("current--image");
		} else if (direction === "left") {
			previousCardEl.style.zIndex = "30";
			nextCardEl.style.zIndex = "20";

			previousBgImageEl.style.zIndex = "-1";

			currentCardEl.classList.add("next--card");
			previousCardEl.classList.add("current--card");
			nextCardEl.classList.add("previous--card");

			currentBgImageEl.classList.add("next--image");
			previousBgImageEl.classList.add("current--image");
			nextBgImageEl.classList.add("previous--image");
		}
	}
}

function changeInfo(direction) {
	let currentInfoEl = cardInfosContainerEl.getElementsByClassName("current--info");
	let previousInfoEl = cardInfosContainerEl.getElementsByClassName("previous--info");
	let nextInfoEl = cardInfosContainerEl.getElementsByClassName("next--info");

	gsap.timeline()
		.to([buttons.prev, buttons.next], {
		duration: 0.2,
		opacity: 0.5,
		pointerEvents: "none",
	})
		.to(
		currentInfoEl.getElementsByClassNameAll("text"),
		{
			duration: 0.4,
			stagger: 0.1,
			translateY: "-120px",
			opacity: 0,
		},
		"-="
	)
		.call(() => {
		swapInfosClass(direction);
	})
		.call(() => initCardEvents())
		.fromTo(
		direction === "right"
		? nextInfoEl.getElementsByClassNameAll("text")
		: previousInfoEl.getElementsByClassNameAll("text"),
		{
			opacity: 0,
			translateY: "40px",
		},
		{
			duration: 0.4,
			stagger: 0.1,
			translateY: "0px",
			opacity: 1,
		}
	)
		.to([buttons.prev, buttons.next], {
		duration: 0.2,
		opacity: 1,
		pointerEvents: "all",
	});

	function swapInfosClass() {
		currentInfoEl.classList.remove("current--info");
		previousInfoEl.classList.remove("previous--info");
		nextInfoEl.classList.remove("next--info");

		if (direction === "right") {
			currentInfoEl.classList.add("previous--info");
			nextInfoEl.classList.add("current--info");
			previousInfoEl.classList.add("next--info");
		} else if (direction === "left") {
			currentInfoEl.classList.add("next--info");
			nextInfoEl.classList.add("previous--info");
			previousInfoEl.classList.add("current--info");
		}
	}
}

function updateCard(e) {
	const card = e.currentTarget;
	const box = card.getBoundingClientRect();
	const centerPosition = {
		x: box.left + box.width / 2,
		y: box.top + box.height / 2,
	};
	let angle = Math.atan2(e.pageX - centerPosition.x, 0) * (35 / Math.PI);
	gsap.set(card, {
		"--current-card-rotation-offset": `${angle}deg`,
	});
	const currentInfoEl = cardInfosContainerEl.getElementsByClassName("current--info");
	gsap.set(currentInfoEl, {
		rotateY: `${angle}deg`,
	});
}

function resetCardTransforms(e) {
	const card = e.currentTarget;
	const currentInfoEl = cardInfosContainerEl.getElementsByClassName("current--info");
	gsap.set(card, {
		"--current-card-rotation-offset": 0,
	});
	gsap.set(currentInfoEl, {
		rotateY: 0,
	});
}

function initCardEvents() {
  const cardsContainerEl = document.querySelector(".cards__wrapper");

  if (cardsContainerEl) {
    const currentCardEl = cardsContainerEl.getElementsByClassName("current--card");

    if (currentCardEl) {
      currentCardEl.addEventListener("pointermove", updateCard);
      currentCardEl.addEventListener("pointerout", (e) => {
        resetCardTransforms(e);
      });
    }
  }
}

initCardEvents();

function removeCardEvents(card) {
	card.removeEventListener("pointermove", updateCard);
}

function init() {

	let tl = gsap.timeline();

	tl.to(cardsContainerEl.children, {
		delay: 0.15,
		duration: 0.5,
		stagger: {
			ease: "power4.inOut",
			from: "right",
			amount: 0.1,
		},
		"--card-translateY-offset": "0%",
	})
		.to(cardInfosContainerEl.getElementsByClassName("current--info").getElementsByClassNameAll(".text"), {
		delay: 0.5,
		duration: 0.4,
		stagger: 0.1,
		opacity: 1,
		translateY: 0,
	})
		.to(
		[buttons.prev, buttons.next],
		{
			duration: 0.4,
			opacity: 1,
			pointerEvents: "all",
		},
		"-=0.4"
	);
}

const waitForImages = () => {
	const images = Array.from(document.getElementsByClassName("img1"));
	//const images = [...document.querySelectorAll("img")];
	const totalImages = images.length;
	let loadedImages = 0;
	const loaderEl = document.getElementsByClassName("loader span");

  const cardsContainerEl = document.querySelector(".cards__wrapper");
  const currentInfoEl = document.querySelector(".info__wrapper .current--info");

  if (cardsContainerEl) {
    const cardElements = Array.from(cardsContainerEl.querySelectorAll(".card"));
    cardElements.forEach((card) => {
      gsap.set(card, {
        "--card-translateY-offset": "100vh",
      });
    });
  }

  if (currentInfoEl) {
    const textElements = Array.from(currentInfoEl.querySelectorAll(".text"));
    textElements.forEach((text) => {
      gsap.set(text, {
        translateY: "40px",
        opacity: 0,
      });
    });
  }

  const buttonsArray = [buttons.prev, buttons.next];
  if (gsap) {
    gsap.set(buttonsArray, {
      pointerEvents: "none",
      opacity: "0",
    });
  }


	images.forEach((image) => {
		imagesLoaded(image, (instance) => {
			if (instance.isComplete) {
				loadedImages++;
				let loadProgress = loadedImages / totalImages;

				gsap.to(loaderEl, {
					duration: 1,
					scaleX: loadProgress,
					backgroundColor: `hsl(${loadProgress * 120}, 100%, 50%`,
				});

				if (totalImages == loadedImages) {
					gsap.timeline()
						.to(".loading__wrapper", {
						duration: 0.8,
						opacity: 0,
						pointerEvents: "none",
					})
						.call(() => init());
				}
			}
		});
	});
};

waitForImages();


export default function ImageSlider() {
  return (
    <main>
      <div className="app">

        <div className="cardList">
          <button className="cardList__btn btn btn--left">
            <div className="icon">
              <svg>
                <use xlinkHref="#arrow-left"></use>
              </svg>
            </div>
          </button>

          <div className="cards__wrapper">
            <div className="card current--card">
              <div className="card__image">
                <img className='img' src="https://source.unsplash.com/Z8dtTatMVMw" alt="" />
              </div>
            </div>

            <div className="card next--card">
              <div className="card__image">
                <img className='img' src="https://source.unsplash.com/9dmycbFE7mQ" alt="" />
              </div>
            </div>

            <div className="card previous--card">
              <div className="card__image">
                <img className='img' src="https://source.unsplash.com/m7K4KzL5aQ8" alt="" />
              </div>
            </div>
          </div>

          <button className="cardList__btn btn btn--right">
            <div className="icon">
              <svg>
                <use xlinkHref="#arrow-right"></use>
              </svg>
            </div>
          </button>
        </div>

        <div className="infoList">
          <div className="info__wrapper">
            <div className="info current--info">
              <h1 className="text name">Highlands</h1>
              <h4 className="text location">Scotland</h4>
              <p className="text description">The mountains are calling</p>
            </div>

            <div className="info next--info">
              <h1 className="text name">Machu Pichu</h1>
              <h4 className="text location">Peru</h4>
              <p className="text description">Adventure is never far away</p>
            </div>

            <div className="info previous--info">
              <h1 className="text name">Chamonix</h1>
              <h4 className="text location">France</h4>
              <p className="text description">Let your dreams come true</p>
            </div>
          </div>
        </div>


        <div className="app__bg">
          <div className="app__bg__image current--image">
            <img className='img1' src="https://source.unsplash.com/Z8dtTatMVMw" alt="" />
          </div>
          <div className="app__bg__image next--image">
            <img className='img1' src="https://source.unsplash.com/9dmycbFE7mQ" alt="" />
          </div>
          <div className="app__bg__image previous--image">
            <img className='img1' src="https://source.unsplash.com/m7K4KzL5aQ8" alt="" />
          </div>
        </div>
        </div>

        <div className="loading__wrapper">
        <div className="loader--text">Loading...</div>
        <div className="loader">
          <span></span>
        </div>
        </div>


        <svg className="icons" style={{ display: 'none' }}>
          <symbol id="arrow-left" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
            <polyline points='328 112 184 256 328 400'
              style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '48px' }} />
          </symbol>
          <symbol id="arrow-right" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
            <polyline points='184 112 328 256 184 400'
              style={{ fill: 'none', stroke: '#fff', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '48px' }} />
          </symbol>
        </svg>









        <div className="support">
        <a href="https://twitter.com/DevLoop01" target="_blank"><i className="fab fa-twitter-square"></i></a>
        <a href="https://dribbble.com/devloop01" target="_blank"><i className="fab fa-dribbble"></i></a>
        </div>
    </main>
  )
}