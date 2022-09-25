export function hourToMinString(hourString: String) {
    const [hs, mins] = hourString.split(':').map(Number);

    return (hs * 60) + mins;
}
