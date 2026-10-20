export function generateRegistrationData() {
    const firstNames = [
        'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 
        'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
        'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra'
    ];
    
    const lastNames = [
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 
        'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
        'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
    ];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    // Используем Date.now() и случайное число для гарантированной уникальности
    const uniqueId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const emailPrefix = process.env.REGISTRATION_EMAIL_PREFIX || 'autotest_user';
    const emailDomain = process.env.REGISTRATION_EMAIL_DOMAIN || 'example.com';
    const email = `${emailPrefix}_${uniqueId}@${emailDomain}`;
    
    // Генерируем пароль, соответствующий требованиям сложности (буквы, цифры, спецсимвол)
    const password = `TestPass_${uniqueId}!`;
    
    return {
        email,
        firstName,
        lastName,
        password,
        repeatPassword: password
    };
}
