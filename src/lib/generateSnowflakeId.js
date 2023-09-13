import FlakeId from "flakeid"

export const generateSnowflakeId = () => {
    const snowflake = new FlakeId({
        offset: (2022 - 1970) * 31536000 * 1000,
        mid: 2485
    });

    return `${snowflake.gen()}`;
}