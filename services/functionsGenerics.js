// data solana format ** REFACTORING
export const convert_data_solana = (dataDiccionary) => {
    const array_humedad = []
    const array_temperatura = []
    const array_irrigations = []
    const array_puerta = []
    const array_deposito = []
    dataDiccionary.map((index, value) => {

        const { _measurement: masurement, _field: field, _time: fecha, _value: valor } = index;

        if (masurement === 'status' && field === 'humedad') {
            const response_item = { fecha, valor, field };
            array_humedad.push(response_item);
        }

        if (masurement === 'status' && field === 'temperatura') {
            const response_item = { fecha, valor, field };
            array_temperatura.push(response_item);
        }

        if (masurement === 'irrigations' && field === 'duration') {
            const response_item = { fecha, valor, field };
            array_irrigations.push(response_item);
        }

        if (masurement === 'status' && field === 'puerta') {
            const response_item = { fecha, valor, field };
            array_puerta.push(response_item);
        }

        if (masurement === 'status' && field === 'agua') {
            const response_item = { fecha, valor, field };
            array_deposito.push(response_item);
        }
    })

    return {
        array_humedad,
        array_temperatura,
        array_irrigations,
        array_puerta,
        array_deposito
    }
}

// data basic format ** REFACTORING
export const convert_data_basic = (dataDiccionary) => {
    const array_impact = []
    const array_temperature = []
    const array_charger1 = []
    const array_charger2 = []
    const array_status_charger1 = []
    const array_status_charger2 = []
    dataDiccionary.map((index, value) => {
        const { _measurement: masurement, _field: field, _time: fecha, _value: valor } = index;
        if (masurement === 'status_impact' && field === 'magnitude') {
            const response_item = { fecha, valor, field };
            array_impact.push(response_item);
        }

        if (masurement === 'status_temp' && field === 'temperatura') {
            const response_item = { fecha, valor, field };
            array_temperature.push(response_item);
        }

        if (masurement === 'charger1' && (field === 'power1')) {
            const response_item = { fecha, valor, field };
            array_charger1.push(response_item);
        }

        if (masurement === 'charger2' && (field === 'power2')) {
            const response_item = { fecha, valor, field };
            array_charger2.push(response_item);
        }

        // charging_started charging_power_changed  charging_stopped
        if (masurement === 'charger1' && field === 'event' && (valor === 'charging_started' || valor === 'charging_power_changed' || valor === 'charging_stopped')) {
            const response_item = { fecha, valor, field };
            array_status_charger1.push(response_item);
        }
        if (masurement === 'charger2' && field === 'event' && (valor === 'charging_started' || valor === 'charging_power_changed' || valor === 'charging_stopped')) {
            const response_item = { fecha, valor, field };
            array_status_charger2.push(response_item);
        }
    })
    return {
        array_impact,
        array_temperature,
        array_charger1,
        array_charger2,
        array_status_charger1,
        array_status_charger2
    }
}

// data franklin format ** REFACTORING
export const convert_data_franklin = (dataDiccionary) => {
    const array_humidity = []
    const array_temperature = []
    const array_pm1 = []
    const array_pm10 = []
    const array_pm2 = []
    const array_pm4 = []
    const array_co2 = []
    const array_nox = []
    const array_voc = []
    const array_ina_219_power = []
    const array_ina_219_current = []
    const array_ina_260_power = []
    const array_ina_260_current = []
    dataDiccionary.map((index, value) => {
        const { _measurement: masurement, _field: field, _time: fecha, _value: valor } = index;
        if (masurement === 'airquality' && field === 'humedad') {
            const response_item = { fecha, valor, field }
            array_humidity.push(response_item)
        }

        if (masurement === 'airquality' && field === 'temperatura') {
            const response_item = { fecha, valor, field }
            array_temperature.push(response_item)
        }

        if (masurement === 'airquality' && field === 'pm1') {
            const response_item = { fecha, valor, field }
            array_pm1.push(response_item)
        }

        if (masurement === 'airquality' && field === 'pm10') {
            const response_item = { fecha, valor, field }
            array_pm10.push(response_item)
        }

        if (masurement === 'airquality' && field === 'pm2') {
            const response_item = { fecha, valor, field }
            array_pm2.push(response_item)
        }

        if (masurement === 'airquality' && field === 'pm4') {
            const response_item = { fecha, valor, field }
            array_pm4.push(response_item)
        }

        if (masurement === 'airquality' && field === 'co2') {
            const response_item = { fecha, valor, field }
            array_co2.push(response_item)
        }

        if (masurement === 'airquality' && field === 'nox') {
            const response_item = { fecha, valor, field }
            array_nox.push(response_item)
        }

        if (masurement === 'airquality' && field === 'voc') {
            const response_item = { fecha, valor, field }
            array_voc.push(response_item)
        }

        if (masurement === 'sensors_data' && field === 'ina219_power') {
            const response_item = { fecha, valor, field }
            array_ina_219_power.push(response_item)
        }

        if (masurement === 'sensors_data' && field === 'ina219_current') {
            const response_item = { fecha, valor, field }
            array_ina_219_current.push(response_item)
        }

        if (masurement === 'sensors_data' && field === 'ina260_power') {
            const response_item = { fecha, valor, field }
            array_ina_260_power.push(response_item)
        }

        if (masurement === 'sensors_data' && field === 'ina260_current') {
            const response_item = { fecha, valor, field }
            array_ina_260_current.push(response_item)
        }
    })

    return {
        array_humidity,
        array_temperature,
        array_pm1,
        array_pm10,
        array_pm2,
        array_pm4,
        array_co2,
        array_nox,
        array_voc,
        array_ina_219_power,
        array_ina_219_current,
        array_ina_260_power,
        array_ina_260_current
    }
}