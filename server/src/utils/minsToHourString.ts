export function minsToHourString(minutes: number) {

    const hour = Math.floor(minutes/60); // => 4 => the times 3 fits into 13  
    const mins = minutes % 60;     

    return (`${String(hour).padStart(2,'0')}:${String(mins).padStart(2,'0')}`)
}
