package com.augusto.login_system.validation;

public final class CpfUtils {
    private CpfUtils() {}

    public static String normalize(String cpf) {
        if (cpf == null) return null;
        return cpf.replaceAll("\\D", "");
    }

    public static boolean isValid(String cpfRaw) {
        String cpf = normalize(cpfRaw);

        if (cpf == null || cpf.length() != 11) return false;

        // rejeita CPFs com todos os dígitos iguais (ex: 11111111111)
        char first = cpf.charAt(0);
        boolean allEqual = true;
        for (int i = 1; i < cpf.length(); i++) {
            if (cpf.charAt(i) != first) {
                allEqual = false;
                break;
            }
        }
        if (allEqual) return false;

        int dv1 = calcDigit(cpf, 9, 10);
        int dv2 = calcDigit(cpf, 10, 11);

        return dv1 == (cpf.charAt(9) - '0') && dv2 == (cpf.charAt(10) - '0');
    }

    private static int calcDigit(String cpf, int length, int weightStart) {
        int sum = 0;
        int weight = weightStart;

        for (int i = 0; i < length; i++) {
            int digit = cpf.charAt(i) - '0';
            sum += digit * weight;
            weight--;
        }

        int mod = sum % 11;
        return (mod < 2) ? 0 : (11 - mod);
    }
}