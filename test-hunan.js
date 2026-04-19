const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const htmlPath = 'file://' + path.resolve(__dirname, 'index.html');
    await page.goto(htmlPath);

    const results = [];

    // 测试1: 湖南地区组件系列限制
    console.log('\n========== 测试1: 湖南地区组件系列限制 ==========');
    await page.selectOption('#province', '湖南省');
    await page.waitForTimeout(300);
    await page.selectOption('#city', '长沙市');
    await page.waitForTimeout(300);
    await page.selectOption('#district', '长沙市');
    await page.waitForTimeout(300);

    const seriesOptions = await page.$$eval('#series option', opts => opts.map(o => o.value));
    console.log('湖南地区可选系列:', seriesOptions);
    const test1Pass = seriesOptions.length === 1 && seriesOptions[0] === 'NEG21_730';
    results.push({ name: '湖南地区只显示730系列', pass: test1Pass, actual: seriesOptions.join(',') });

    // 测试2: 非湖南地区显示全部系列
    console.log('\n========== 测试2: 非湖南地区显示全部系列 ==========');
    await page.selectOption('#province', '福建省');
    await page.waitForTimeout(300);
    await page.selectOption('#city', '泉州市');
    await page.waitForTimeout(300);
    await page.selectOption('#district', '鲤城区');
    await page.waitForTimeout(300);

    const allSeriesOptions = await page.$$eval('#series option', opts => opts.map(o => o.value));
    console.log('福建地区可选系列:', allSeriesOptions);
    const test2Pass = allSeriesOptions.includes('NEG21_715') && allSeriesOptions.includes('NEG21_730') && allSeriesOptions.includes('NEG22_800');
    results.push({ name: '非湖南地区显示全部系列', pass: test2Pass, actual: allSeriesOptions.join(',') });

    // 测试3-6: 湖南地区1.2倍不同数量
    const hunan12Tests = [
        { count: 65, expectedInv: '17+25', expectedBox: '50', desc: '65块 -> 17+25(42kW)' },
        { count: 68, expectedInv: '17+25', expectedBox: '50', desc: '68块 -> 17+25(42kW)' },
        { count: 70, expectedInv: '20+25', expectedBox: '50', desc: '70块 -> 20+25(45kW)' },
        { count: 75, expectedInv: '17+30', expectedBox: '50', desc: '75块 -> 17+30(47kW)' }
    ];

    for (const test of hunan12Tests) {
        console.log(`\n========== 测试: 湖南1.2倍 ${test.desc} ==========`);
        await page.selectOption('#province', '湖南省');
        await page.selectOption('#city', '张家界市');
        await page.selectOption('#district', '张家界市');
        await page.waitForTimeout(300);
        await page.selectOption('#series', 'NEG21_730');
        // 强制设置容配比
        await page.evaluate(() => {
            document.getElementById('ratio').value = '1.2倍(正常)';
        });
        await page.fill('#count', test.count.toString());
        await page.click('button:has-text("智能匹配查询")');
        await page.waitForTimeout(500);

        const inv = await page.textContent('#resInv');
        const box = await page.textContent('#resBox');
        console.log(`数量:${test.count} 逆变器:${inv} 并网箱:${box}`);
        const pass = inv.includes(test.expectedInv) && box.includes(test.expectedBox);
        results.push({ name: `1.2倍 ${test.desc}`, pass: pass, actual: `${inv} / ${box}` });
    }

    // 测试7-9: 湖南地区1.1倍不同数量
    const hunan11Tests = [
        { count: 60, expectedInv: '17+25', expectedBox: '50', desc: '60块 -> 17+25(42kW)' },
        { count: 65, expectedInv: '20+25', expectedBox: '50', desc: '65块 -> 20+25(45kW)' },
        { count: 68, expectedInv: '17+30', expectedBox: '50', desc: '68块 -> 17+30(47kW)' }
    ];

    for (const test of hunan11Tests) {
        console.log(`\n========== 测试: 湖南1.1倍 ${test.desc} ==========`);
        await page.selectOption('#province', '湖南省');
        await page.selectOption('#city', '张家界市');
        await page.selectOption('#district', '张家界市');
        await page.waitForTimeout(300);
        await page.selectOption('#series', 'NEG21_730');
        await page.evaluate(() => {
            document.getElementById('ratio').value = '1.1倍';
        });
        await page.fill('#count', test.count.toString());
        await page.click('button:has-text("智能匹配查询")');
        await page.waitForTimeout(500);

        const inv = await page.textContent('#resInv');
        const box = await page.textContent('#resBox');
        console.log(`数量:${test.count} 逆变器:${inv} 并网箱:${box}`);
        const pass = inv.includes(test.expectedInv) && box.includes(test.expectedBox);
        results.push({ name: `1.1倍 ${test.desc}`, pass: pass, actual: `${inv} / ${box}` });
    }

    // 测试10-12: 湖南地区1倍不同数量
    const hunan1Tests = [
        { count: 55, expectedInv: '17+25', expectedBox: '50', desc: '55块 -> 17+25(42kW)' },
        { count: 58, expectedInv: '20+25', expectedBox: '50', desc: '58块 -> 20+25(45kW)' },
        { count: 62, expectedInv: '17+30', expectedBox: '50', desc: '62块 -> 17+30(47kW)' }
    ];

    for (const test of hunan1Tests) {
        console.log(`\n========== 测试: 湖南1倍 ${test.desc} ==========`);
        await page.selectOption('#province', '湖南省');
        await page.selectOption('#city', '张家界市');
        await page.selectOption('#district', '张家界市');
        await page.waitForTimeout(300);
        await page.selectOption('#series', 'NEG21_730');
        await page.evaluate(() => {
            document.getElementById('ratio').value = '1倍';
        });
        await page.fill('#count', test.count.toString());
        await page.click('button:has-text("智能匹配查询")');
        await page.waitForTimeout(500);

        const inv = await page.textContent('#resInv');
        const box = await page.textContent('#resBox');
        console.log(`数量:${test.count} 逆变器:${inv} 并网箱:${box}`);
        const pass = inv.includes(test.expectedInv) && box.includes(test.expectedBox);
        results.push({ name: `1倍 ${test.desc}`, pass: pass, actual: `${inv} / ${box}` });
    }

    // 测试13: 边界 - 湖南54块应回到标准配置（36kW）
    console.log('\n========== 测试13: 边界 湖南1.2倍 54块 ==========');
    await page.selectOption('#province', '湖南省');
    await page.selectOption('#city', '张家界市');
    await page.selectOption('#district', '张家界市');
    await page.waitForTimeout(300);
    await page.selectOption('#series', 'NEG21_730');
    await page.evaluate(() => { document.getElementById('ratio').value = '1.2倍(正常)'; });
    await page.fill('#count', '54');
    await page.click('button:has-text("智能匹配查询")');
    await page.waitForTimeout(500);
    const inv54 = await page.textContent('#resInv');
    const box54 = await page.textContent('#resBox');
    console.log('54块:', inv54, box54);
    // 54块在标准730中对应36kW
    const test13Pass = inv54.includes('36') && box54.includes('50');
    results.push({ name: '边界 54块 -> 36kW 50kW箱(回退标准)', pass: test13Pass, actual: `${inv54} / ${box54}` });

    // 测试14: 福建地区标准配置
    console.log('\n========== 测试14: 福建 730 1.2倍 54块 ==========');
    await page.selectOption('#province', '福建省');
    await page.selectOption('#city', '泉州市');
    await page.selectOption('#district', '鲤城区');
    await page.waitForTimeout(300);
    await page.selectOption('#series', 'NEG21_730');
    await page.evaluate(() => { document.getElementById('ratio').value = '1.2倍(正常)'; });
    await page.fill('#count', '54');
    await page.click('button:has-text("智能匹配查询")');
    await page.waitForTimeout(500);
    const inv54fj = await page.textContent('#resInv');
    const box54fj = await page.textContent('#resBox');
    console.log('54块:', inv54fj, box54fj);
    const test14Pass = inv54fj.includes('36') && box54fj.includes('50');
    results.push({ name: '福建 54块 -> 36kW 50kW箱', pass: test14Pass, actual: `${inv54fj} / ${box54fj}` });

    // 输出汇总
    console.log('\n========================================');
    console.log('              自动化测试汇总              ');
    console.log('========================================\n');

    let passCount = 0, failCount = 0;
    results.forEach((r, i) => {
        const status = r.pass ? '✓ 通过' : '✗ 失败';
        console.log(`${i+1}. ${status} - ${r.name}`);
        console.log(`   实际: ${r.actual}`);
        if(r.pass) passCount++; else failCount++;
    });

    console.log('\n========================================');
    console.log(`总计: ${passCount} 通过, ${failCount} 失败`);
    console.log('========================================\n');

    await browser.close();
    process.exit(failCount > 0 ? 1 : 0);
})();