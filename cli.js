#!/usr/bin/env node
'use strict';

// Dépendances
const {URL} = require('url');
const meow = require('meow');
const speedtest = require('speedtest-net');
const roundTo = require('round-to');
const chalk = require('chalk');
const logUpdate = require('log-update');
const Ora = require('ora');

// Utilisation de meow pour le CLI
const cli = meow(`
	Utilisation
	  $ speedtest

	Options
	  --fast -f         Speedtest plus rapide / plus court
	  --version -v      Indique la version actuellement utilisé
`, {
	flags: {
		fast: {
			type: 'boolean',
			alias: 'f'
		},		
		version: {
			type: 'boolean',
			alias: 'v'
		}
	},
	autoVersion: false
});

// Donner la version avec l'option associé
if(cli.flags.version){
	console.log("Votre Speedtest utilise actuellement la version 3.1.0")
	console.log("\nV2- : " + chalk.cyan("https://github.com/sindresorhus/speed-test"))
	console.log("V3+ : " + chalk.cyan("https://github.com/johan-perso/speedtest"))
	return process.exit()
}

// Définition des stats par défaut
const stats = {
	ping: '',
	download: '',
	upload: ''
};

// Quelques petites variables
let state = 'ping';
const spinner = new Ora();
const unit = 'Mbps';
const multiplier = 1;
const getSpinnerFromState = inputState => inputState === state ? chalk.gray.dim(spinner.frame()) : '  ';

// Function des logs d'erreur
function logError(error){
	console.log(chalk.red(error));
}

// Afficher le speedtest
function render(){

	let output = `
  Ping         ${getSpinnerFromState('ping')}${stats.ping}
  Descendant   ${getSpinnerFromState('download')}${stats.download}
  Asendant     ${getSpinnerFromState('upload')}${stats.upload}`;

	output += [
		'\n',
		'  Serveur        ' + (stats.data === undefined ? '' : chalk.cyan(stats.data.server.host)),
		'  Localisation   ' + (stats.data === undefined ? '' : chalk.cyan(stats.data.server.location + chalk.dim(' (' + stats.data.server.country + ')'))),
		'  Distance       ' + (stats.data === undefined ? '' : chalk.cyan(roundTo(stats.data.server.distance, 1) + chalk.dim(' km')))
	].join('\n');

	logUpdate(output);
}

function setState(newState) {
	state = newState;

	if (newState && newState.length > 0) {
		stats[newState] = chalk.yellow(`0 ${chalk.dim(unit)}`);
	}
}

function map(server) {
	server.host = new URL(server.url).host;
	server.location = server.name;
	server.distance = server.dist;
	return server;
}

// Temps maximum pour le speedtest
if (cli.flags.fast) var timeMax = 6 * 1000
if (!cli.flags.fast) var timeMax = 15 * 1000
const st = speedtest({maxTime: timeMax});

setInterval(render, 50);

st.once('testserver', server => {
	stats.data = {
		server: map(server)
	};

	setState('download');
	const ping = Math.round(server.bestPing);
	stats.ping = chalk.cyan(ping + chalk.dim(' ms'));
});

// Vitesse de prorès en download
st.on('downloadspeedprogress', speed => {
	if (state === 'download') {
		speed *= multiplier;
		const download = roundTo(speed, speed >= 10 ? 1 : 1);
		stats.download = chalk.yellow(`${download} ${chalk.dim(unit)}`);
	}
});

// Vitesse de prorès en upload
st.on('uploadspeedprogress', speed => {
	if (state === 'upload') {
		speed *= multiplier;
		const upload = roundTo(speed, speed >= 10 ? 1 : 1);
		stats.upload = chalk.yellow(`${upload} ${chalk.dim(unit)}`);
	}
});

// Vitesse en download
st.once('downloadspeed', speed => {
	setState('upload');
	speed *= multiplier;
	const download = roundTo(speed, speed >= 10 && !cli.flags.json ? 1 : 1);
	stats.download = cli.flags.json ? download : chalk.cyan(download + ' ' + chalk.dim(unit));
});

// Vitesse en upload
st.once('uploadspeed', speed => {
	setState('');
	speed *= multiplier;
	const upload = roundTo(speed, speed >= 10 && !cli.flags.json ? 1 : 1);
	stats.upload = cli.flags.json ? upload : chalk.cyan(upload + ' ' + chalk.dim(unit));
});

// Au moment d'obtenir des données
st.on('data', data => {
	stats.data = data;
	render();
});

// Quand le test est terminé
st.on('done', () => {
	console.log();
	process.exit();
});

// En cas d'erreur
st.on('error', error => {
	if (error.code === 'ENOTFOUND') {
		logError("Erreur de réseau...");
	} else {
		logError(error);
	}

	process.exit(1);
});
