// --- Change Bidirectional Association to Unidirectional (після рефакторингу) ---
# Пакети Customer і Order (Після рефакторингу)
# Видалено зворотний зв’язок, щоб зробити асоціацію односпрямованою

package Customer;

sub new {
    my $class = shift;
    my $self = {
        _orders => [],
    };
    bless $self, $class;
    return $self;
}

sub add_order {
    my ($self, $order) = @_;
    push @{ $self->{_orders} }, $order;
}

1;

package Order;

sub new {
    my $class = shift;
    my $self = {};
    bless $self, $class;
    return $self;
}

1;


// --- Change Bidirectional Association to Unidirectional (до рефакторингу) ---
# Пакети Customer і Order (До рефакторингу)
# Використовується двонаправлений зв’язок між об'єктами

package Customer;

sub new {
    my $class = shift;
    my $self = {
        _orders => [],
    };
    bless $self, $class;
    return $self;
}

sub add_order {
    my ($self, $order) = @_;
    push @{ $self->{_orders} }, $order;
    $order->{_customer} = $self;
}

1;

package Order;

sub new {
    my $class = shift;
    my $self = {
        _customer => undef,
    };
    bless $self, $class;
    return $self;
}

1;


// --- Change Value to Reference (після рефакторингу) ---
# Пакет Product (Після рефакторингу)
# Використання одного екземпляру для однакових значень price

package Product;

my %instances;  # Збереження посилань на існуючі об'єкти

sub new {
    my $class = shift;
    my $price = shift;

    # Перевіряємо, чи існує вже об'єкт з такою ціною
    if (exists $instances{$price}) {
        return $instances{$price};
    }

    my $self = {
        _price => $price,
    };
    bless $self, $class;
    
    $instances{$price} = $self;
    return $self;
}

sub set_price {
    my ($self, $price) = @_;
    $self->{_price} = $price;
}

sub get_price {
    my $self = shift;
    return $self->{_price};
}

1;


// --- Change Value to Reference (до рефакторингу) ---
# Пакет Product (До рефакторингу)
# Кожен продукт має власне значення price

package Product;

sub new {
    my $class = shift;
    my $self = {
        _price => shift,
    };
    bless $self, $class;
    return $self;
}

sub get_price {
    my $self = shift;
    return $self->{_price};
}

1;


// --- Self Encapsulate Field (після рефакторингу) ---
# Пакет Employee (Після рефакторингу)
# Використання геттерів і сеттерів для інкапсуляції доступу до поля _salary

package Employee;

sub new {
    my $class = shift;
    my $self = {
        _salary => shift,
    };
    bless $self, $class;
    return $self;
}

sub set_salary {
    my ($self, $salary) = @_;
    $self->{_salary} = $salary;
}

sub get_salary {
    my $self = shift;
    return $self->{_salary};
}

sub print_salary {
    my $self = shift;
    print "Зарплата: " . $self->get_salary() . "\n";
}

1;


// --- Self Encapsulate Field (до рефакторингу) ---
# Пакет Employee (До рефакторингу)
# Цей клас містить приватне поле _salary, яке використовується напряму

package Employee;

sub new {
    my $class = shift;
    my $self = {
        _salary => shift,
    };
    bless $self, $class;
    return $self;
}

sub print_salary {
    my $self = shift;
    print "Зарплата: $self->{_salary}\n";
}

1;


