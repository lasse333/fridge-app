import { langText, getLang } from "./language.js"

const aMilisecond = 1
const aSecond = 1000 * aMilisecond
const aMinute = 60 * aSecond
const anHour = 60 * aMinute
const aDay = 24 * anHour
const aWeek = 7 * aDay
const aMonth = 30 * aDay
const aYear = 365 * aDay


function timeLeft(timestampIn) {

    let timestamp = +timestampIn

    let deltaTime = timestamp - Date.now()


    return deltaTime

}


export function toDaysLeft(timestampIn) {

    return timeLeft(timestampIn) / aDay

}

export function toWeeksLeft(timestampIn) {

    return timeLeft(timestampIn) / aWeek

}

export function toMonthsLeft(timestampIn) {

    return timeLeft(timestampIn) / aMonth

}

export function toYearsLeft(timestampIn) {

    return timeLeft(timestampIn) / aYear

}

export function convertReadable(timestampIn) {
    
    let deltaTime = timeLeft(timestampIn)
    let timeLeftReadable

    switch (true) {

        case deltaTime > aYear-aDay:
            timeLeftReadable = Math.ceil(toYearsLeft(timestampIn)) + " " + langText[getLang()]["datetime"]["year"]
            break
        
        case deltaTime > aMonth-(aDay*3):
            timeLeftReadable = Math.ceil(toMonthsLeft(timestampIn)) + " " + langText[getLang()]["datetime"]["month"]
            break

        case deltaTime > aWeek-aDay:
            timeLeftReadable = Math.ceil(toWeeksLeft(timestampIn)) + " " + langText[getLang()]["datetime"]["week"]
            break

        case deltaTime > 0:
            timeLeftReadable = Math.ceil(toDaysLeft(timestampIn)) + " " + langText[getLang()]["datetime"]["day"]
            break
    }


    return timeLeftReadable

}

export function toDateString(timestampIn, locale) {
    let date = new Date(+timestampIn)
    
    return date.toLocaleDateString(locale, {
        weekday: "short",
        month: "short",
        day: "2-digit",
        year: "numeric"
    })
}
