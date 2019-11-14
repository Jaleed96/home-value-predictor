const { BigQuery } = require('@google-cloud/bigquery');
const { spawn } = require('child_process');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const predictValue = (latitude, longitude) => {

    const bigqueryClient = new BigQuery();

    const sqlQuery = `SELECT IFNULL(TYPE_Break_and_Enter_Commercial, 0) AS TYPE_Break_and_Enter_Commercial,
    IFNULL(TYPE_Break_and_Enter_Residential_Other, 0) AS TYPE_Break_and_Enter_Residential_Other,
    IFNULL(TYPE_Mischief, 0) AS TYPE_Mischief,
    IFNULL(TYPE_Other_Theft, 0) AS TYPE_Other_Theft,
    IFNULL(TYPE_Theft_from_Vehicle, 0) AS TYPE_Theft_from_Vehicle,
    IFNULL(TYPE_Theft_of_Vehicle, 0) AS TYPE_Theft_of_Vehicle,
    IFNULL(TYPE_Vehicle_Collision_or_Pedestrian_Struck__with_Fatality_, 0) AS TYPE_Vehicle_Collision_or_Pedestrian_Struck__with_Fatality_,
    IFNULL(TYPE_Vehicle_Collision_or_Pedestrian_Struck__with_Injury_, 0) AS TYPE_Vehicle_Collision_or_Pedestrian_Struck__with_Injury_,
    IFNULL(NEIGHBOURHOOD_Arbutus_Ridge, 0) AS NEIGHBOURHOOD_Arbutus_Ridge,
    IFNULL(NEIGHBOURHOOD_Dunbar_Southlands, 0) AS NEIGHBOURHOOD_Dunbar_Southlands,
    IFNULL(NEIGHBOURHOOD_Fairview, 0) AS NEIGHBOURHOOD_Fairview,
    IFNULL(NEIGHBOURHOOD_Grandview_Woodland, 0) AS NEIGHBOURHOOD_Grandview_Woodland,
    IFNULL(NEIGHBOURHOOD_Hastings_Sunrise, 0) AS NEIGHBOURHOOD_Hastings_Sunrise,
    IFNULL(NEIGHBOURHOOD_Kensington_Cedar_Cottage, 0) AS NEIGHBOURHOOD_Kensington_Cedar_Cottage,
    IFNULL(NEIGHBOURHOOD_Kerrisdale, 0) AS NEIGHBOURHOOD_Kerrisdale,
    IFNULL(NEIGHBOURHOOD_Marpole, 0) AS NEIGHBOURHOOD_Marpole,
    IFNULL(NEIGHBOURHOOD_Mount_Pleasant, 0) AS NEIGHBOURHOOD_Mount_Pleasant,
    IFNULL(NEIGHBOURHOOD_Musqueam, 0) AS NEIGHBOURHOOD_Musqueam,
    IFNULL(NEIGHBOURHOOD_Renfrew_Collingwood, 0) AS NEIGHBOURHOOD_Renfrew_Collingwood,
    IFNULL(NEIGHBOURHOOD_Riley_Park, 0) AS NEIGHBOURHOOD_Riley_Park,
    IFNULL(NEIGHBOURHOOD_Shaughnessy, 0) AS NEIGHBOURHOOD_Shaughnessy,
    IFNULL(NEIGHBOURHOOD_South_Cambie, 0) AS NEIGHBOURHOOD_South_Cambie,
    IFNULL(NEIGHBOURHOOD_Stanley_Park, 0) AS NEIGHBOURHOOD_Stanley_Park,
    IFNULL(NEIGHBOURHOOD_Strathcona, 0) AS NEIGHBOURHOOD_Strathcona,
    IFNULL(NEIGHBOURHOOD_Sunset, 0) AS NEIGHBOURHOOD_Sunset,
    IFNULL(NEIGHBOURHOOD_West_End, 0) AS NEIGHBOURHOOD_West_End,
    IFNULL(NEIGHBOURHOOD_West_Point_Grey, 0) AS NEIGHBOURHOOD_West_Point_Grey,
    elementary_area,
    secondary_area
  FROM
  (SELECT 1 AS row)
  LEFT JOIN
  (
    SELECT 1 AS row,
    SUM(TYPE_Break_and_Enter_Commercial) AS TYPE_Break_and_Enter_Commercial,
    SUM(TYPE_Break_and_Enter_Residential_Other) AS TYPE_Break_and_Enter_Residential_Other,
    SUM(TYPE_Mischief) AS TYPE_Mischief,
    SUM(TYPE_Other_Theft) AS TYPE_Other_Theft,
    SUM(TYPE_Theft_from_Vehicle) AS TYPE_Theft_from_Vehicle,
    SUM(TYPE_Theft_of_Vehicle) AS TYPE_Theft_of_Vehicle,
    SUM(TYPE_Vehicle_Collision_or_Pedestrian_Struck__with_Fatality_) AS TYPE_Vehicle_Collision_or_Pedestrian_Struck__with_Fatality_,
    SUM(TYPE_Vehicle_Collision_or_Pedestrian_Struck__with_Injury_) AS TYPE_Vehicle_Collision_or_Pedestrian_Struck__with_Injury_,
    SUM(NEIGHBOURHOOD_Arbutus_Ridge) AS NEIGHBOURHOOD_Arbutus_Ridge,
    SUM(NEIGHBOURHOOD_Dunbar_Southlands) AS NEIGHBOURHOOD_Dunbar_Southlands,
    SUM(NEIGHBOURHOOD_Fairview) AS NEIGHBOURHOOD_Fairview,
    SUM(NEIGHBOURHOOD_Grandview_Woodland) AS NEIGHBOURHOOD_Grandview_Woodland,
    SUM(NEIGHBOURHOOD_Hastings_Sunrise) AS NEIGHBOURHOOD_Hastings_Sunrise,
    SUM(NEIGHBOURHOOD_Kensington_Cedar_Cottage) AS NEIGHBOURHOOD_Kensington_Cedar_Cottage,
    SUM(NEIGHBOURHOOD_Kerrisdale) AS NEIGHBOURHOOD_Kerrisdale,
    SUM(NEIGHBOURHOOD_Marpole) AS NEIGHBOURHOOD_Marpole,
    SUM(NEIGHBOURHOOD_Mount_Pleasant) AS NEIGHBOURHOOD_Mount_Pleasant,
    SUM(NEIGHBOURHOOD_Musqueam) AS NEIGHBOURHOOD_Musqueam,
    SUM(NEIGHBOURHOOD_Renfrew_Collingwood) AS NEIGHBOURHOOD_Renfrew_Collingwood,
    SUM(NEIGHBOURHOOD_Riley_Park) AS NEIGHBOURHOOD_Riley_Park,
    SUM(NEIGHBOURHOOD_Shaughnessy) AS NEIGHBOURHOOD_Shaughnessy,
    SUM(NEIGHBOURHOOD_South_Cambie) AS NEIGHBOURHOOD_South_Cambie,
    SUM(NEIGHBOURHOOD_Stanley_Park) AS NEIGHBOURHOOD_Stanley_Park,
    SUM(NEIGHBOURHOOD_Strathcona) AS NEIGHBOURHOOD_Strathcona,
    SUM(NEIGHBOURHOOD_Sunset) AS NEIGHBOURHOOD_Sunset,
    SUM(NEIGHBOURHOOD_West_End) AS NEIGHBOURHOOD_West_End,
    SUM(NEIGHBOURHOOD_West_Point_Grey) AS NEIGHBOURHOOD_West_Point_Grey
  FROM \`price_predicion_datasets\`.\`crime_data_transformed\` c
  WHERE c.\`YEAR\` > 2014 AND ST_DISTANCE(c.\`GEOM\`, ST_GEOGFROMTEXT("POINT(` + latitude + " " + longitude + `)")) < 500
  ) cc
  USING(row)
  LEFT JOIN
  (
   SELECT 1 AS row, \`NAME\` AS elementary_area
   FROM \`price_predicion_datasets\`.\`school_catchment_areas_elementary\` e
   WHERE ST_CONTAINS(e.\`GEOM\`, ST_GEOGFROMTEXT("POINT(` + latitude + " " + longitude + `)"))
  )
  USING(row)
  LEFT JOIN
  (
   SELECT 1 AS row, \`NAME\` AS secondary_area
   FROM \`price_predicion_datasets\`.\`school_catchment_areas_secondary\` s
   WHERE ST_CONTAINS(s.\`GEOM\`, ST_GEOGFROMTEXT("POINT(` + latitude + " " + longitude + `)"))
  )
  USING(row)`;

    const options = {
        query: sqlQuery,
        location: 'US',
    };

    // Run the query
    bigqueryClient.query(options).then(rows => {
        row = rows[0][0]
        if (row["elementary_area"]) elementary_area[row["elementary_area"]] = 1
        else elementary_area["nan"] = 1
        if (row["secondary_area"]) secondary_area[row["secondary_area"]] = 1
        else secondary_area["nan"] = 1

        const header = []
        header.push({ id: 'REPORT_YEAR', title: 'REPORT_YEAR' })
        for (const column in row) {
            if (column != "elementary_area" && column != "secondary_area")
                header.push({ id: column, title: column })
        }
        for (const column in elementary_area) {
            header.push({
                id: "elementary_area_" + column,
                title: "elementary_area_" + column
            })
        }
        for (const column in secondary_area) {
            header.push({
                id: "secondary_area_" + column,
                title: "secondary_area_" + column
            })
        }

        const csvWriter = createCsvWriter({
            path: 'input.csv',
            header: header
        });

        const data = { REPORT_YEAR: 2020 }
        for (const column in row) {
            if (column != "elementary_area" && column != "secondary_area")
                data[column] = row[column]
        }

        for (const column in elementary_area) {
            data["elementary_area_" + column] = elementary_area[column]
        }
        for (const column in secondary_area) {
            data["secondary_area_" + column] = secondary_area[column]
        }

        csvWriter.writeRecords([data]).then(() => {
            runPy.then(data => {
                console.log(data.toString());
            }).catch(err => console.log(err));
        });
    });
}


predictValue(-123.222868575653, 49.2748818573243);


let runPy = new Promise((success, nosuccess) => {
    const pyprog = spawn('python', ['./model.py']);

    pyprog.stdout.on('data', (data) => {
        success(data);
    });

    pyprog.stderr.on('data', (data) => {
        nosuccess(data);
    });
});

const elementary_area = {
    "Admiral Seymour Elementary": 0,
    "Bayview Community Elementary": 0,
    "Captain James Cook Elementary": 0,
    "Champlain Heights Community Elementary": 0,
    "Chief Maquinna Elementary": 0,
    "David Oppenheimer Elementary": 0,
    "Dr H N MacCorkindale Elementary": 0,
    "Edith Cavell Elementary": 0,
    "Elsie Roy Elementary": 0,
    "False Creek Elementary": 0,
    "Florence Nightingale Elementary": 0,
    "General Gordon Elementary": 0,
    "Henry Hudson Elementary": 0,
    "Lord Roberts Elementary": 0,
    "Lord Selkirk Elementary": 0,
    "Maple Grove Elementary": 0,
    "Mount Pleasant Elementary": 0,
    "Pierre Elliott Trudeau Elementary": 0,
    "Queen Elizabeth Elementary": 0,
    "Queen Mary Elementary": 0,
    "Quilchena Elementary": 0,
    "Sir James Douglas Elementary": 0,
    "Sir John Franklin Community": 0,
    "Southlands Elementary": 0,
    "Thunderbird Elementary": 0,
    "nan": 0,
}

const secondary_area = {
    "David Thompson Secondary": 0,
    "Eric Hamber Secondary": 0,
    "Gladstone Secondary": 0,
    "John Oliver Secondary": 0,
    "Killarney Secondary": 0,
    "King George Secondary": 0,
    "Kitsilano Secondary": 0,
    "Lord Byng Secondary": 0,
    "Prince of Wales Secondary": 0,
    "Sir Winston Churchill Secondary": 0,
    "nan": 0,
}

