const links = [
  '/schedule',
  '/calculators/visit-window',
  '/calculators/enrollment-rate',
  '/calculators/study-duration',
  '/calculators/dropout-rate',
  '/calculators/screening-failure',
  '/calculators/protocol-deviation',
  '/calculators/randomization',
  '/compliance',
  '/calculators/bmi',
  '/calculators/bsa',
  '/calculators/dose',
  '/calculators/egfr',
  '/calculators/creatinine-clearance',
  '/calculators/infusion-rate',
  '/calculators/unit-converter',
  '/calculators/sample-size',
  '/calculators/confidence-interval',
  '/calculators/odds-ratio',
  '/calculators/hazard-ratio',
  '/calculators/p-value'
];

async function check() {
  for (const link of links) {
    try {
      const res = await fetch(`http://localhost:3000/ko${link}`);
      if (res.status !== 200) {
         console.log('FAIL:', link, res.status);
      }
    } catch (e) {
      console.log('ERR:', link, e.message);
    }
  }
  console.log('done');
}
check();
