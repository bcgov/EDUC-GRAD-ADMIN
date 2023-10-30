import { base_url, api_html_status_threshold, max_acceptable_timeout } from '../config/constants';
import { RequestLogger, Selector } from 'testcafe';
import { apiCallsFailed } from '../helpers/requestHelper';
import adminUser from '../config/roles';
import CoursesPage from '../page_objects/coursesPage';
import commonUtils from '../helpers/commonUtils.js';

const log = require('npmlog');
const courseLogger = RequestLogger(/api\/v1\/course/, {logResponseBody: true, logResponseHeaders: true});
const coursesPage = new CoursesPage();

fixture `course-restrictions`
    .requestHooks(courseLogger)
    .page(base_url)
    .beforeEach( async t => {
        await t
            .useRole(adminUser)
            .navigateTo(base_url)
            .click(coursesPage.view)
            .click(coursesPage.restrictionsTab);
    })
    .afterEach(() => log.info(apiCallsFailed(courseLogger, api_html_status_threshold)));

    test('table loads', async t => {
        await t
        .expect(coursesPage.courseRestrictionsTab.exists, {timeout: max_acceptable_timeout}).ok();
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
        }
    });

    test('table sorting', async t => {

        const maxCols = 6;
        const maxRows = 20; //use this until pagnation

        for (let index = 0; index < maxCols * 2; index++) {
            let row = 1;
            let col = Math.floor(index / 2) + 1;

            // clicks on column header to sort
            await t.click(Selector(`th[role=columnheader][aria-colindex="${col}"] div`));
            
            while (row <= maxRows) {
                let prevCell = await coursesPage.getCellValue(col, row);
                row++;
                let curCell = await coursesPage.getCellValue(col, row);

                // loop through cells in in column to test sorting.
                // cols 3 and 5 are singled out beause they are sorted descending order while the rest are ascending
                if (index % 2 == 0 && (col != 3 && col != 5) || index % 2 == 1 && (col == 3 || col == 5)) {
                    await t.expect(commonUtils.isAscending(curCell, prevCell)).ok(`index: ${index}, col: ${col} and row: ${row}\nExpected "${prevCell}" to be less than "${curCell}"`);
                    
                } else {
                    await t.expect(commonUtils.isDescending(curCell, prevCell)).ok(`index: ${index}, col: ${col} and row: ${row}\nExpected "${prevCell}" to be greater than "${curCell}"`);
                }
            }
        }
        
    })
    .meta({
        testSuites: {
            smoke: false,
            regression: true,
        }
    });

    // not a great test for table filtering.
    // TODO: change this to check if each row contains filtered value
    // test('table filter', async t => {
    //     await t
    //     .click(coursesPage.courseRestrictionsFilter)
    //     .typeText(coursesPage.courseRestrictionsFilter, "cop")
    //     .wait(max_acceptable_timeout)
    //     .expect(Selector('.table-responsive table[aria-colcount="6"] tbody').child('tr').count === 6).ok(); 
    // })
