import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  Alert,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useMembers } from "@/providers/member-provider";
import { calculateSettlements, Settlement } from "@/utils/split";
import { Currencies } from "@/utils/currencies";
import { Money } from "@/utils/money";
import { Member } from "@/utils/user";

export default function SettlePage() {
  const members = useMembers();
  const settlements = calculateSettlements(
    members.map((member) => ({
      id: member.id,
      balance: member.amountSpent.getAmount() - member.amountShare.getAmount(),
    })),
  );
  const membersById = new Map(members.map((member) => [member.id, member]));

  return (
    <Box sx={{ pb: 12 }}>
      <Box sx={{ px: 2, py: 2 }}>
        <Typography variant="h5">Settle up</Typography>
        <Typography color="text.secondary">
          The fewest payments needed to clear everyone&apos;s balance.
        </Typography>
      </Box>
      {settlements.length === 0 ? (
        <Alert
          icon={<CheckCircleOutlineIcon />}
          severity="success"
          sx={{ mx: 2 }}
        >
          Everyone is settled up.
        </Alert>
      ) : (
        <List sx={{ p: 0 }}>
          {settlements.map((settlement) => (
            <SettlementItem
              key={`${settlement.payerId}-${settlement.recipientId}`}
              settlement={settlement}
              payer={membersById.get(settlement.payerId)}
              recipient={membersById.get(settlement.recipientId)}
            />
          ))}
        </List>
      )}
    </Box>
  );
}

function SettlementItem({
  settlement,
  payer,
  recipient,
}: {
  settlement: Settlement;
  payer?: Member;
  recipient?: Member;
}) {
  if (!payer || !recipient) {
    return null;
  }

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={`/static/images/avatar/${payer.avatarUri}.jpg`}>
          {payer.name.charAt(0)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={`${payer.name} pays ${recipient.name}`}
        secondary="to settle the balance"
      />
      <Typography variant="h6" sx={{ ml: 2, whiteSpace: "nowrap" }}>
        {new Money(settlement.amount, Currencies.EUR).toString()}
      </Typography>
    </ListItem>
  );
}
