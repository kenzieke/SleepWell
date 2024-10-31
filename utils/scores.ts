import { Results, CategoryDetails } from "../stores/resultsStore";

const scaleImage = require('../assets/scale.png');
const scale1Image = require('../assets/0_marker.png');
const scale2Image = require('../assets/20_marker.png');
const scale3Image = require('../assets/50_marker.png');
const scale4Image = require('../assets/80_marker.png');
const scale5Image = require('../assets/100_marker.png');

const getInsomniaSeverityDescription = (score: number) => {
  let description = "The ISI score is a widely recognized and clinically validated screening tool used by clinicians to evaluate insomnia. Here's what the score means: ";
  if (score >= 8 && score <= 14) {
    description += `Sub-threshold insomnia - Sleep Well offers effective strategies to manage occasional sleep difficulties, enhance sleep quality, and prevent the progression into chronic insomnia.`;
  } else if (score >= 15 && score <= 21) {
    description += `Moderate insomnia - Sleep Well helps identify and modify thoughts and behaviors that contribute to sleep difficulties, introduces techniques like sleep restriction and stimulus control to help regulate sleep patterns, and offers ways to manage stress, anxiety, and negative thoughts that can interfere with sleep.`;
  } else if (score >= 22 && score <= 28) {
    description += `Severe insomnia - Sleep Well delivers a science-based, comprehensive intervention for severe insomnia, employing sleep restriction, stimulus control, relaxation techniques, and cognitive restructuring to address sleep difficulties and promote sustainable improvements in sleep duration and quality.`;
  } else {
    description += `Not clinically significant insomnia - Tailor how the app will help you.`;
  }
  return `${description}\n\n*Note: this is not meant to be a medical diagnosis of insomnia.`;
};

const getSleepApneaDescription = (score: number) => {
  let riskLevel;
  switch (score) {
    case 5:
      riskLevel = 'high';
      break;
    case 3:
      riskLevel = 'at';
      break;
    case 1:
      riskLevel = 'low';
      break;
    default:
      riskLevel = 'an undetermined';
      break;
  }
  return `You appear at ${riskLevel} risk for having obstructive sleep apnea. Sleep apnea has been linked to daytime sleepiness, reduced alertness, lethargy and impaired driving. It is also associated with hypertension and stroke. To determine if you have sleep apnea, it is necessary to be evaluated by a physician. 

*Note: this is not meant to be a medical diagnosis of sleep apnea.`;
};

const getBMIDescription = (score: number) => {
  let bmiRange;
  if (score >= 18 && score <= 25) {
    bmiRange = 'in a healthy range';
  } else if (score > 25 && score <= 30) {
    bmiRange = 'an area for some improvement';
  } else if (score > 30) {
    bmiRange = 'an area for improvement';
  } else {
    bmiRange = 'an undetermined';
  }
  return `Your body mass index is ${bmiRange}.

BMI is not a perfect measure but can help determine risk of sleep disorders and chronic diseases. If you have a BMI of 25 or more, our program includes proven strategies to promote healthy weight loss to improve sleep.`;
};

const getDietDescription = (score: number) => {
  let dietScore;
  switch (score) {
    case 5:
      dietScore = 'an area for improvement';
      break;
    case 3:
      dietScore = 'getting there';
      break;
    case 1:
      dietScore = 'doing great';
      break;
    default:
      dietScore = 'an undetermined';
      break;
  }
  return `Your diet is ${dietScore}.
  
A healthy diet with minimal caffeine and sugary beverages is ideal for sleep. Also pay attention to make sure you have plenty of vegetables.`;
};

const getActivityDescription = (score: number) => {
  let pa;
  switch (score) {
    case 5:
      pa = 'an area for improvement';
      break;
    case 3:
      pa = 'getting there';
      break;
    case 1:
      pa = 'doing great';
      break;
    default:
      pa = 'an undetermined';
      break;
  }
  return `Your physical activity is ${pa}.

A healthy diet with minimal caffeine and sugary beverages is ideal for sleep. Also pay attention to make sure you have plenty of vegetables.`
};

const getStressDescription = (score: number) => {
  let stressScore;
  switch (score) {
    case 5:
      stressScore = 'an area for improvement';
      break;
    case 3:
      stressScore = 'getting there';
      break;
    case 1:
      stressScore = 'doing great';
      break;
    default:
      stressScore = 'an undetermined';
      break;
  }
  return `Your stress is ${stressScore}.
  
Managing stress is a key part of sleep health. Our program provides tools to help manage stress both on and off duty.`;
};

export const getCategoryDetails = (results: Results): Record<string, CategoryDetails> => ({
  'Insomnia Severity Index': {
    image: results.insomniaSeverityIndex && results.insomniaSeverityIndex >= 8 && results.insomniaSeverityIndex <= 12
            ? scale1Image
            : results.insomniaSeverityIndex && results.insomniaSeverityIndex >= 13 && results.insomniaSeverityIndex <= 17
            ? scale2Image
            : results.insomniaSeverityIndex && results.insomniaSeverityIndex >= 18 && results.insomniaSeverityIndex <= 22
            ? scale3Image
            : results.insomniaSeverityIndex && results.insomniaSeverityIndex >= 23 && results.insomniaSeverityIndex <= 26
            ? scale4Image
            : results.insomniaSeverityIndex && results.insomniaSeverityIndex >= 27 && results.insomniaSeverityIndex <= 28
            ? scale5Image
            : scaleImage,
    score: results.insomniaSeverityIndex ?? 'Not available',
    description: results.insomniaSeverityIndex ? getInsomniaSeverityDescription(results.insomniaSeverityIndex) : 'No score available.',
  },
  'Sleep Apnea Risk': {
    image: results.sleepApneaRisk === 5
            ? scale1Image
            : results.sleepApneaRisk === 3
            ? scale3Image
            : scale5Image,
    score: results.sleepApneaRisk ?? 'Not available',
    description: results.sleepApneaRisk ? getSleepApneaDescription(results.sleepApneaRisk) : 'No score available.',
  },
  'Sleep Efficiency': {
    image: results.sleepEfficiency && results.sleepEfficiency <= 20
            ? scale5Image
            : results.sleepEfficiency && results.sleepEfficiency <= 40
            ? scale4Image
            : results.sleepEfficiency && results.sleepEfficiency <= 60
            ? scale3Image
            : results.sleepEfficiency && results.sleepEfficiency <= 80
            ? scale4Image
            : scale5Image,
    score: results.sleepEfficiency ?? 'Not available',
    description: `Your sleep efficiency is the percent of time that you spent asleep while in bed. The higher your sleep efficiency, the better.\n\nMost sleep specialists consider a sleep efficiency of 85% and higher to be healthy.\n\nOur program is designed to help firefighters improve their sleep efficiency. This means falling asleep faster and improving sleep quality and duration.`,
  },
  'Body Mass Index': {
    image: results.bmi && results.bmi < 18
            ? scale5Image
            : results.bmi && results.bmi <= 25
            ? scale2Image
            : results.bmi && results.bmi <= 30
            ? scale3Image
            : scale4Image,
    score: results.bmi ?? 'Not available',
    description: results.bmi ? getBMIDescription(results.bmi) : 'No score available.',
  },
  'Diet': {
    image: results.diet === 1
            ? scale1Image
            : results.diet === 3
            ? scale3Image
            : scale5Image,
    score: results.diet ?? 'Not available',
    description: results.diet ? getDietDescription(results.diet) : 'No score available.',
  },
  'Physical Activity': {
    image: results.physicalActivity && results.physicalActivity <= 20
            ? scale5Image
            : results.physicalActivity && results.physicalActivity <= 40
            ? scale4Image
            : results.physicalActivity && results.physicalActivity <= 60
            ? scale3Image
            : results.physicalActivity && results.physicalActivity <= 80
            ? scale4Image
            : scale5Image,
    score: results.physicalActivity ?? 'Not available',
    description: results.physicalActivity ? getActivityDescription(results.physicalActivity) : 'No score available.',
  },
  'Stress': {
    image: results.stress === 5
            ? scale1Image
            : results.stress === 3
            ? scale3Image
            : scale5Image,
    score: results.stress ?? 'Not available',
    description: results.stress ? getStressDescription(results.stress) : 'No score available.',
  }
});
