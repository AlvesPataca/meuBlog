const { formatDate } = require('./script.js');

describe('formatDate', () => {
    it('should format the date to the correct day, but fails due to timezone bug', () => {
        const dateString = '2025-09-15';

        // Set timezone to one where the bug is reproducible
        const originalTimeZone = process.env.TZ;
        process.env.TZ = 'America/Sao_Paulo';

        const formattedDate = formatDate(dateString);

        // This assertion will fail with the buggy code, because it will produce '14 de setembro de 2025'
        expect(formattedDate).toBe('15 de setembro de 2025');

        // Restore original timezone
        process.env.TZ = originalTimeZone;
    });
});
