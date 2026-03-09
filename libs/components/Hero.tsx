'use client'; // required for Next.js app directory

import React, { useEffect } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import CustomEase from 'gsap/CustomEase';
import SplitType from 'split-type';

gsap.registerPlugin(Flip, CustomEase);

const Hero = () => {
	useEffect(() => {
		// Custom eases
		CustomEase.create('hop', 'M0,0 C0.355,0.022 0.448,0.079 0.5,0.5 0.542,0.846 0.615,1 1,1 ');
		CustomEase.create('hop2', 'M0,0 C0.078,0.617 0.114,0.716 0.255,0.828 0.373,0.922 0.561,1 1,1 ');

		// Split heading text
		const splitH2 = new SplitType('.site-info h2', { types: 'lines' });
		splitH2.lines.forEach((line) => {
			const wrapper = document.createElement('div');
			wrapper.className = 'line';
			const span = document.createElement('span');
			span.textContent = line.textContent;
			wrapper.appendChild(span);
			line.parentNode.replaceChild(wrapper, line);
		});

		const mainTl = gsap.timeline();
		const revealerTl = gsap.timeline();
		const scaleTl = gsap.timeline();

		// Reveal animation
		revealerTl
			.to('.r-1', { clipPath: 'polygon(0% 0%,100% 0%,100% 0%,0% 0%)', duration: 1.5, ease: 'hop' })
			.to('.r-2', { clipPath: 'polygon(0% 100%,100% 100%,100% 100%,0% 100%)', duration: 1.5, ease: 'hop' }, '<');

		// Scale images
		scaleTl.to('.img:first-child', { scale: 1, duration: 2, ease: 'power4.inOut' });
		const images = document.querySelectorAll('.img:not(:first-child)');
		images.forEach((img) => {
			scaleTl.to(img, { opacity: 1, scale: 1, duration: 1.25, ease: 'power3.out' }, '>-0.95');
		});

		mainTl
			.add(revealerTl)
			.add(scaleTl, '-=1.25')
			.add(() => {
				document.querySelectorAll('.img:not(.main)').forEach((img) => img.remove());
				const state = Flip.getState('.main');
				document.querySelector('.images')?.classList.add('stacked-container');
				document.querySelectorAll('.main').forEach((img, i) => {
					img.classList.add('stacked');
					(img as HTMLElement).style.order = i.toString();
					gsap.set('.img.stacked', { clearProps: 'transform,top,left' });
				});
				return Flip.from(state, { duration: 2, ease: 'hop', absolute: true, stagger: { amount: -0.3 } });
			})
			.to('.word h1, .nav-item p, .line p, .site-info h2 .line span', {
				y: 0,
				duration: 3,
				ease: 'hop2',
				stagger: 0.1,
				delay: 1.25,
			})
			.to('.team-img', {
				clipPath: 'polygon(0% 100%,100% 100%,100% 0%,0% 0%)',
				duration: 2,
				ease: 'hop',
				delay: -4.75,
			});
	}, []);

	return (
		<div className="container">
			<div className="revealers">
				<div className="revealer r-1"></div>
				<div className="revealer r-2"></div>
			</div>

			<div className="images">
				<div className="img">
					<img src="/img/assets/img1.jpeg" alt="" />
				</div>
				<div className="img">
					<img src="/img/assets/img2.jpeg" alt="" />
				</div>
				<div className="img">
					<img src="/img/assets/img3.jpeg" alt="" />
				</div>
				<div className="img">
					<img src="/img/assets/img4.jpeg" alt="" />
				</div>
				<div className="img">
					<img src="/img/assets/img5.jpeg" alt="" />
				</div>
				<div className="img main">
					<img src="/img/assets/img6.jpeg" alt="" />
				</div>
				<div className="img main">
					<img src="/img/assets/img7.jpeg" alt="" />
				</div>
				<div className="img main">
					<img src="/img/assets/img8.jpeg" alt="" />
				</div>
			</div>

			<div className="hero-content">{/* Add your logo, nav, site-info, team-img here */}</div>
		</div>
	);
};

export default Hero;
