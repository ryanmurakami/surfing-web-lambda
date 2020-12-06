const chromium = require('chrome-aws-lambda')

module.exports.headline = async event => {
  const outlet = event.pathParameters.outlet
  const outletInfo = urlForOutlet(outlet)

  try {
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    })

    const page = await browser.newPage()
    await page.goto(outletInfo.url)
    const el = await page.$(outletInfo.tag)
    const headline = await (await el.getProperty('textContent')).jsonValue()
    return {
      statusCode: 200,
      body: JSON.stringify(headline)
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 502,
      body: JSON.stringify(err)
    }
  }
}

function urlForOutlet (outlet) {
  switch (outlet) {
    case 'nytimes':
      return {
        url: 'https://www.nytimes.com',
        tag: '.balancedHeadline'
      }
    case 'wp':
      return {
        url: 'https://www.washingtonpost.com/',
        tag: '.font--headline span'
      }
  }
}