import { CurrencyFormat } from "@/services/CurrencyFormat";

import { Text } from "@chakra-ui/react";

export default function Currency({
    amount,
    textColor,
    fontWeight,
}: {
    amount: number;
    textColor?: string;
    fontWeight?: string;
}) {
    return (
        <Text textColor={textColor} fontWeight={fontWeight}>
            {CurrencyFormat.format(amount)}
        </Text>
    );
}
