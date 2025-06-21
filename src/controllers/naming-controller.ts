export const getValidName = (name: string): string => {
    return name.replace(/[&\/\\#,+()$~%.'":*?<>{}|]/g, "");
};