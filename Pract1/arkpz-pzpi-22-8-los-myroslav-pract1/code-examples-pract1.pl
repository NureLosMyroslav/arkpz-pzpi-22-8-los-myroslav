#!usr/bin/perl
use strict;
use warnings;

# Чистий код: правильне використання імен змінних
sub multiply_numbers {
    my ($first_number, $second_number) = @_;
    return $first_number * $second_number;
}

# Неправильний код
sub f {
    my ($x, $y) = @_;
    return $x * $y;
}

# Використання констант замість "магічних чисел"
use constant TAX_RATE => 0.2;
my $total_price = $item_price + ($item_price * TAX_RATE);

# Неправильний код
my $total_price_wrong = $item_price + ($item_price * 0.2);

# Використання strict і warnings
my $var = "Hello";
print $var;

# Неправильний код
$var = "Hello";  # Змінна не була оголошена
print $Var;      # Помилка у назві змінної

# Правильне використання хешу
my %user_info = (
    name => "Miroslav",
    age  => 19,
);
foreach my $key (keys %user_info) {
    print "$key: $user_info{$key}\n";
}

# Неправильний код
$user_info{name} = "Miroslav";
$user_info{age} = 19;
print "$user_info{name}, $user_info{age}\n";

# Відкриття та читання файлів
open(my $fh, '<', 'file.txt') or die "Не вдалося відкрити файл: $!";
while (my $line = <$fh>) {
    print $line;
}
close($fh);

# Запис у файл
open(my $fh, '>', 'output.txt') or die "Не вдалося створити файл: $!";
print $fh "Hello, World!\n";
close($fh);

# Парсинг CSV-файлу
use Text::CSV;
my $csv = Text::CSV->new({ binary => 1 }) or die "Не вдалося створити CSV-об'єкт: $!";
open(my $fh_csv, '<', 'data.csv') or die "Не вдалося відкрити файл: $!";
while (my $row = $csv->getline($fh_csv)) {
    print join(", ", @$row), "\n";
}
close($fh_csv);

# Неправильний код для CSV
my $csv_wrong = Text::CSV->new({ binary => 1 });
open my $fh_wrong, "<", "data.csv" or die "Не вдалося відкрити файл: $!";
while (my $row = $csv_wrong->getline($fh_wrong)) {
    print join(", ", @$row), "\n";
}
close $fh_wrong;
